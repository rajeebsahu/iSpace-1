from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


from rest_framework import status
from django.utils import timezone


import datetime
from rest_framework.decorators import action
from Apis.models import admin,Employees,ChennaiRooms,BookingHistory,OfficeSeat,BangaloreRooms,MeetingRoom,ProjectRomm,ConferenceRoom
from Apis.serializers import adminSerializers,EmployeesSerializers,ChennaiRoomsSerializers,OfficeSeatSerializers,BookingHistorySerializer,BangaloreRoomsSerializers,ProjectRommSerializers,ConferenceRoomSerializers

@method_decorator(csrf_exempt, name='dispatch')
class adminViewSet(viewsets.ModelViewSet):
    queryset = admin.objects.all()
    serializer_class = adminSerializers
    

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
    
        print(f"Login attempt for: {email}")
    
        try:
            user_obj = admin.objects.get(email=email, password=password)
        
            # FIX: Pass the request context here
            serializer = adminSerializers(user_obj, context={'request': request})
        
            return Response(serializer.data, status=status.HTTP_200_OK)

        except admin.DoesNotExist:
            return Response({'message': 'Incorrect Email or Password'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error: {e}")
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 

@method_decorator(csrf_exempt, name='dispatch')
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employees.objects.all()
    serializer_class = EmployeesSerializers
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
    
    # Debugging
        print(f"Login attempt for: {email}")

        try:
            # 1. Use 'Employees' (your model name) NOT 'User'
            # 2. Make sure you have imported Employees at the top of the file
            user_obj = Employees.objects.get(email=email, password=password)
        
            # 3. Use your serializer to return the data
            serializer = EmployeesSerializers(user_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Employees.DoesNotExist: # 4. Must be ModelName.DoesNotExist
            return Response({'message': 'Incorrect Email or Password'}, status=status.HTTP_400_BAD_REQUEST)
    
        except Exception as e:
            # Catch any other weird errors
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChennaiRooms
from .serializers import ChennaiRoomsSerializers
import datetime
from .ai_utilities import predict_specific_booking

class ChennaiRoomViewSet(viewsets.ModelViewSet):
    queryset = ChennaiRooms.objects.all()
    serializer_class = ChennaiRoomsSerializers

    def list(self, request, *args, **kwargs):
        """Checks every room and promotes future bookings if time is up"""
        rooms = ChennaiRooms.objects.all()
        now = datetime.datetime.now()
        current_time_str = now.strftime("%H:%M")

        for room in rooms:
            # room = ChennaiRooms.objects.get(id=room_id)
            room.check_and_reset() 

            # 1. Promote Next Booking if current one is finished
            # We check if room is occupied and if the release time has passed
            if room.availability_status and room.ReleaseTiming and room.ReleaseTiming != "N/A":
                if current_time_str >= room.ReleaseTiming:
                    print("hiiiRoom")
                    if room.FutureBookings and len(room.FutureBookings) > 0:
                        # Pick the next booking from the JSON list
                        next_booking = room.FutureBookings.pop(0)
                        
                        room.Occupied_by = next_booking.get('occupied_by')
                        room.OccuipedTiming = next_booking.get('BookingTime')
                        room.ReleaseTiming = next_booking.get('ReleaseTime')
                        room.BookedBy = next_booking.get('Bookedby')
                        room.availability_status = True
                    else:
                        print("HelloRoom")
                        # No more bookings in queue, make room free
                        room.availability_status = False
                        room.Occupied_by = "N/A"
                        room.OccuipedTiming = "N/A"
                        room.ReleaseTiming = "N/A"
                        room.BookedBy = "N/A"
                    room.save()
            
            # 2. Run your existing reset logic if needed
                # room.check_and_reset() 

        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bookroom(self, request):
        room_id = request.data.get('id')
        new_booking_data = {
            'MainRoom': request.data.get('MainRoom'),
            'occupied_by': request.data.get('occupied_by'),
            'BookingTime': request.data.get('BookingTime'),
            'ReleaseTime': request.data.get('ReleaseTime'),
            'Bookedby': request.data.get('Bookedby'),
            'date': request.data.get('date')
        }

        try:
            room = ChennaiRooms.objects.get(id=room_id)
            
            # If room is ALREADY occupied, add to FutureBookings queue
            if room.availability_status == True:
                # Ensure FutureBookings is initialized as a list
                if not isinstance(room.FutureBookings, list):
                    room.FutureBookings = []
                
                room.FutureBookings.append(new_booking_data)
                room.save()
                return Response({
                    'message': 'Room is occupied. Added to Future Bookings queue.',
                    'queue_position': len(room.FutureBookings)
                }, status=201)
            
            # If room is FREE, book it normally
            room.MainRoomName = new_booking_data['MainRoom']
            room.Occupied_by = new_booking_data['occupied_by']
            room.OccuipedTiming = new_booking_data['BookingTime']
            room.ReleaseTiming = new_booking_data['ReleaseTime']
            room.BookedBy = new_booking_data['Bookedby']
            room.availability_status = True
            room.save()
            
            return Response({'message': 'Room booked successfully!'}, status=200)

        except ChennaiRooms.DoesNotExist:
            return Response({'message': 'Room not found'}, status=404)
    
    @action(detail=False, methods=['post'])
    def cancel_booking(self, request):
        room_id = request.data.get('id')
        try:
            room = ChennaiRooms.objects.get(id=room_id)
            
            # Reset the room fields
            room.availability_status = False  # Set back to Available
            room.Occupied_by = "N/A"
            room.OccuipedTiming = "N/A"
            room.ReleaseTiming = "N/A"
            room.BookedBy = "N/A"
            room.save()
            
            return Response({'message': 'Booking cancelled successfully'}, status=200)
        except ChennaiRooms.DoesNotExist:
            return Response({'message': 'Room not found'}, status=404)
        except Exception as e:
            return Response({'message': str(e)}, status=400)
    @action(detail=False, methods=['post'])
    def edit_booking(self, request):
        room_id = request.data.get('id')
        try:
            room = ChennaiRooms.objects.get(id=room_id)
            
            # Update only the time and date related fields
            room.OccuipedTiming = request.data.get('BookingTime')
            room.ReleaseTiming = request.data.get('ReleaseTime')
            # If you add a date field to your model, update it here too:
            # room.date = request.data.get('date')
            
            room.save()
            return Response({'message': 'Booking updated successfully'}, status=200)
        except ChennaiRooms.DoesNotExist:
            return Response({'message': 'Room not found'}, status=404)
        except Exception as e:
            return Response({'message': str(e)}, status=400)
    
    # @action(detail=False, methods=['get'])
    # def get_ai_suggestions(self, request):
    #     user_email = request.query_params.get('email')
    #     room = request.query_params.get('room')
    #     date = request.query_params.get('date')
    #     time = request.query_params.get('time')
    
    #     if not all([user_email, room, date, time]):
    #         return Response({"error": "Missing parameters"}, status=400)
    
    #     prediction = predict_specific_booking(user_email, room, date, time)
    #     return Response(prediction, status=200)
    # views.py

    @action(detail=False, methods=['get'])
    def get_ai_suggestions(self, request):
        # Get parameters from request
        user_email = request.query_params.get('email') # Optional now
        room = request.query_params.get('room')
        date = request.query_params.get('date')
        time = request.query_params.get('time')

        if not all([room, date, time]):
            return Response({"error": "Missing parameters"}, status=400)
        prediction = predict_specific_booking(room, date, time) 
        return Response(prediction, status=200)
        
class BookingHistoryViewSet(viewsets.ModelViewSet):
    queryset = BookingHistory.objects.all().order_by('-id') # Latest first
    serializer_class = BookingHistorySerializer # You'll need to create this serializer
    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        """Custom action to wipe all history records"""
        count = BookingHistory.objects.all().count()
        BookingHistory.objects.all().delete()
        return Response({"message": f"Successfully deleted {count} records."}, status=200)


class SeatViewSet(viewsets.ModelViewSet):
    queryset = OfficeSeat.objects.all()
    serializer_class = OfficeSeatSerializers

    def list(self, request, *args, **kwargs):
        # Trigger the auto-release/promotion logic for all seats
        seats = OfficeSeat.objects.all()
        for seat in seats:
            seat.check_and_release()
        return super().list(request, *args, **kwargs)

    # @action(detail=False, methods=['post'])
    # def book_multiple_seats(self, request):
    #     seat_ids = request.data.get('seat_ids', [])
    #     new_booking = {
    #         'booked_by_name': request.data.get('booked_by_name'),
    #         'booked_by_email': request.data.get('booked_by_email'),
    #         'team_name': request.data.get('team_name'),
    #         'booking_date': request.data.get('booking_date'),
    #         'start_time': request.data.get('start_time'),
    #         'release_time': request.data.get('release_time')
    #     }

    #     for s_id in seat_ids:
    #         seat = OfficeSeat.objects.get(seat_id=s_id)
    #         if not seat.is_available:
    #             # Add to Queue
    #             if not isinstance(seat.FutureBookings, list):
    #                 seat.FutureBookings = []
    #             seat.FutureBookings.append(new_booking)
    #             seat.save()
    #         else:
    #             # Book immediately
    #             OfficeSeat.objects.filter(seat_id=s_id).update(
    #                 is_available=False,
    #                 **new_booking
    #             )
        
    #     return Response({'message': 'Bookings processed (some may be queued).'}, status=200)

    #     # POST: Cancel specific seat
    @action(detail=False, methods=['post'])
    def book_multiple_seats(self, request):
        seat_ids = request.data.get('seat_ids', [])
        b_date = request.data.get('booking_date')
        b_start = request.data.get('start_time')
        
        now_local = timezone.localtime(timezone.now())
        today_str = now_local.strftime("%Y-%m-%d")

        for s_id in seat_ids:
            try:
                seat = OfficeSeat.objects.get(seat_id=s_id)
                
                # 1. OCCUPANCY CHECK: If red on map, add to queue
                if not seat.is_available:
                    if not isinstance(seat.FutureBookings, list):
                        seat.FutureBookings = []
                    seat.FutureBookings.append(request.data)
                    seat.save()
                
                # 2. DATE CHECK: If green but for tomorrow, add to queue
                elif b_date > today_str:
                    if not isinstance(seat.FutureBookings, list):
                        seat.FutureBookings = []
                    seat.FutureBookings.append(request.data)
                    seat.save()
                
                # 3. IMMEDIATE BOOKING: Green and for today
                else:
                    seat.is_available = False
                    seat.booked_by_name = request.data.get('booked_by_name')
                    seat.booked_by_email = request.data.get('booked_by_email')
                    seat.team_name = request.data.get('team_name')
                    seat.booking_date = b_date
                    seat.start_time = b_start
                    seat.release_time = request.data.get('release_time')
                    seat.save()
            except OfficeSeat.DoesNotExist:
                continue
                
        return Response({'message': 'Bookings processed.'}, status=200)
    @action(detail=False, methods=['post'])
    def cancel_booking(self, request):
        seat_id = request.data.get('seat_id')
        OfficeSeat.objects.filter(seat_id=seat_id).update(
            is_available=True, booked_by_name="", booked_by_email="", 
            team_name="", release_time=None, start_time=None, booking_date=None
        )
        return Response({'message': f'Seat {seat_id} is now available.'}, status=200)

    @action(detail=False, methods=['post'])
    def edit_booking(self, request):
        seat_id = request.data.get('seat_id')
        try:
            seat = OfficeSeat.objects.get(seat_id=seat_id)
            seat.start_time = request.data.get('start_time', seat.start_time)
            seat.release_time = request.data.get('release_time', seat.release_time)
            seat.booking_date = request.data.get('booking_date', seat.booking_date)
            seat.booked_by_name = request.data.get('booked_by_name', seat.booked_by_name)
            seat.team_name = request.data.get('team_name', seat.team_name)
            seat.booked_by_email = request.data.get('booked_by_email', seat.booked_by_email)
            seat.save()
            return Response({'message': f'Seat {seat_id} booking updated successfully.'}, status=200)
        except OfficeSeat.DoesNotExist:
            return Response({'message': 'Seat not found'}, status=404)
        except Exception as e:
            return Response({'message': str(e)}, status=400)
class BangaloreRoomViewSet(viewsets.ModelViewSet):

    queryset = BangaloreRooms.objects.all()
    serializer_class = BangaloreRoomsSerializers

    def list(self, request, *args, **kwargs):
        """Checks and resets every room whenever the list is requested"""
        rooms = BangaloreRooms.objects.all()
        for room in rooms:
            room.check_and_reset()
        
        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bookroom(self, request):
        room_name = request.data.get('room_name')
        print(room_name)
        
        try:
            # 1. Get the room
            room = BangaloreRooms.objects.get(room_name=room_name)
            
            # 2. Run reset logic first to see if it just became available
            room.check_and_reset()
            print(room.availability_status)
            if room.availability_status == True:
                return Response({'message': 'Room is already occupied'}, status=400)
            # 3. Update the existing room row with new data
            elif room.availability_status == False:
                room.MainRoomName = request.data.get('MainRoom', 'Training Room')
                room.Occupied_by = request.data.get('occupied_by', 'Guest')
                room.OccuipedTiming = request.data.get('BookingTime')
                room.ReleaseTiming = request.data.get('ReleaseTime')
                room.availability_status = True  # Mark as occupied
                room.BookedBy = request.data.get('Bookedby', 'Employee')
                room.save()
            serializer = BangaloreRoomsSerializers(room)
            return Response(serializer.data, status=200)

        except BangaloreRooms.DoesNotExist:
            return Response({'message': 'Room not found'}, status=404)
        except Exception as e:
            return Response({'message': str(e)}, status=400)
        """Checks and resets every room whenever the list is requested"""
        rooms = BangaloreRooms.objects.all()
        for room in rooms:
            room.check_and_reset()
        
        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)

    # @action(detail=False, methods=['post'])
    # def bookroom(self, request):
    #     room_name = request.data.get('room_name')
    #     print(room_name)
        
    #     try:
    #         # 1. Get the room
    #         room = BangaloreRooms.objects.get(room_name=room_name)
            
    #         # 2. Run reset logic first to see if it just became available
    #         room.check_and_reset()
    #         print(room.availability_status)
    #         if room.availability_status == True:
    #             return Response({'message': 'Room is already occupied'}, status=400)
    #         # 3. Update the existing room row with new data
    #         elif room.availability_status == False:
    #             room.MainRoomName = request.data.get('MainRoom', 'Training Room')
    #             room.Occupied_by = request.data.get('occupied_by', 'Guest')
    #             room.OccuipedTiming = request.data.get('BookingTime')
    #             room.ReleaseTiming = request.data.get('ReleaseTime')
    #             room.availability_status = True  # Mark as occupied
    #             room.BookedBy = request.data.get('Bookedby', 'Employee')
    #             room.save()
    #         serializer = BangaloreRoomsSerializers(room)
    #         return Response(serializer.data, status=200)

    #     except BangaloreRooms.DoesNotExist:
    #         return Response({'message': 'Room not found'}, status=404)
    #     except Exception as e:
    #         return Response({'message': str(e)}, status=400)
    @action(detail=False, methods=['post'])
    def bookroom(self, request):
        room_id = request.data.get('id')
        b_date = request.data.get('date')
        b_start = request.data.get('BookingTime')
    
        room = ChennaiRooms.objects.get(id=room_id)
    
        now_local = timezone.localtime(timezone.now())
        today = now_local.strftime("%Y-%m-%d")
        current_time = now_local.strftime("%H:%M")

        # If the booking starts in the future (different day or later today)
        is_future = (b_date > today) or (b_date == today and b_start > current_time)

        if is_future:
            if not isinstance(room.FutureBookings, list):
                room.FutureBookings = []
            room.FutureBookings.append(request.data)
            room.save()
            return Response({'message': 'Future booking added to schedule.'}, status=201)
        else:
            # Immediate Booking
            room.availability_status = True
            room.Occupied_by = request.data.get('occupied_by')
            room.OccuipedTiming = b_start
            room.ReleaseTiming = request.data.get('ReleaseTime')
            room.BookedBy = request.data.get('Bookedby')
            room.save()
            return Response({'message': 'Room booked successfully!'}, status=200)
