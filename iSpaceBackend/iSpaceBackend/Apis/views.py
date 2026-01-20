from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password

from rest_framework import status


import datetime
from rest_framework.decorators import action
from Apis.models import admin,Employees,ChennaiRooms,BangaloreRooms,MeetingRoom,ProjectRomm,ConferenceRoom
from Apis.serializers import adminSerializers,EmployeesSerializers,ChennaiRoomsSerializers,BangaloreRoomsSerializers,ProjectRommSerializers,ConferenceRoomSerializers


class adminViewSet(viewsets.ModelViewSet):
    queryset = admin.objects.all()
    serializer_class = adminSerializers

    @action(detail=False, methods=['get'])
    def login(self, request):
        name = request.data.get('adminname')
        password = request.data.get('adminpassword')
        print(name)
        print(password)
        try:
            admin = admin.objects.get(name=name, password=password)
            return Response(adminSerializers(admin).data)
        except Admin.DoesNotExist:
            return Response({'message': 'wrong details'}, status=400)
    @action(detail=False, methods=['post'])
    def add_admin(self, request):
        # Directly providing the data to the serializer
        data = {
            'name': 'admin',  # Mapping userName to 'name'
            'password': 'admin@123'
        }
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Admin added successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employees.objects.all()
    serializer_class = EmployeesSerializers
    @action(detail=False, methods=['post'])
    def setuserEdit(self, request):
        print("Received query parameters:", request.query_params)
        user_id = request.query_params.get('userEmail')
        Username = request.data.get("userName")
        userEmail = request.data.get("userEmail_id")
        userMobile = request.data.get("userMobile")
        UserGender = request.data.get("UserGender")
        userAddress = request.data.get("userAddress")
        print(user_id)
        print(Username)
        try:
            # Fetch the user object based on the provided id
            user_instance = user.objects.get(email=user_id)
            print(user_id)
            
            # Update fields of the user instance
            user_instance.name = Username
            user_instance.email = userEmail
            user_instance.alt_email = useAlterEmail
            user_instance.mobile = userMobile
            user_instance.gender = UserGender
            user_instance.address = userAddress
            
            # Save the updated user instance
            user_instance.save()
            
            # Serialize and return the updated user data
            serializer = userSerializers(user_instance, context={'request': request})
            return Response(serializer.data, status=200)
        except user.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)
           
        except Exception as e:
            print(e)
            return Response({'message': 'Unable to set data'}, status=400)
    @action(detail=False, methods=['post'])
    def changepassword(self,request):
        userEmail = request.data.get("userEmail")
        currentpassword =  request.data.get("currentpassword")
        newpassword = request.data.get("newpassword")
        print("Request Data:", request.data)
        try:
            user_instance = user.objects.get(email=userEmail)
            print(user_instance.password)
            if (currentpassword == user_instance.password):
                user_instance.password = newpassword
                user_instance.save()
                print(user_instance.password)
                serializer = userSerializers(user_instance, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Current password is incorrect'}, status=400)
        
        except user.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)
        
        except Exception as e:
            print(f"Error: {e}")
            return Response({'message': 'Unable to change password'}, status=400)
    @action(detail=False, methods=['get'])
    def login(self, request):
        email = request.data.get('useremail')
        password = request.data.get('userpassword')
        try:
            user = User.objects.get(email=email, password=password)
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({'message': 'Incorrect Email or Password'}, status=400)
    @action(detail=False, methods=['get'])
    def viewUser(self, request):
        print("Received query parameters:", request.query_params)
        email = request.query_params.get('userEmail')
        print(email)
        if not email:
            return Response({'message': 'Email parameter is required'}, status=400)
        try:
            # Use filter to get all matching tickets
            users = Employees.objects.filter(email=email)
            if users.exists():
                serializer = EmployeesSerializers(users, many=True, context={'request': request})
                return Response(serializer.data)
            else:
                return Response({'message': 'No tickets found for this email'}, status=404)
        except Exception as e:
            print(e)
            return Response({'message': 'An error occurred'}, status=500)
    @action(detail=False , methods=['post'])
    def submitedit(self,request):
        user_id = request.query_params.get("Id")
        Username =  request.data.get("Username")
        userEmail =  request.data.get("userEmail")
        useAlterEmail =  request.data.get("useAlterEmail")
        userMobile =  request.data.get("userMobile")
        UserGender = request.data.get("UserGender")
        userAddress = request.data.get("userAddress")
        userPassword = request.data.get("userPassword")
        print(user_id)
        try:
             user_instance = Employees.objects.get(id=user_id)
             user_instance.name = Username
             user_instance.email = userEmail
             user_instance.alt_email = useAlterEmail
             user_instance.mobile = userMobile
             user_instance.gender =UserGender
             user_instance.address = userAddress
             user_instance.password =userPassword
             user_instance.save()
             serializer = EmployeesSerializers(user_instance, context={'request': request})
             return Response(serializer.data, status=200)
        except Employees.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)
        except Exception as e:
            print(e)
            return Response({'message': 'Unable to edit data'}, status=400)
    @action(detail=False , methods=['delete'])
    def submitdelete(self,request):
        user_id = request.data.get("Id1")
        print(user_id)
        try:
            user_instance = user.objects.get(id = user_id)
            print(user_instance)
            user_instance.delete()
            serializer = EmployeesSerializers(user_instance, context={'request': request})
            return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Employees.DoesNotExist:
            return Response({'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': 'Unable to delete task'}, status=status.HTTP_400_BAD_REQUEST)
            

class ChennaiRoomViewSet(viewsets.ModelViewSet):

    queryset = ChennaiRooms.objects.all()
    serializer_class = ChennaiRoomsSerializers

    def list(self, request, *args, **kwargs):
        """Checks and resets every room whenever the list is requested"""
        rooms = ChennaiRooms.objects.all()
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
    #         room = ChennaiRooms.objects.get(room_name=room_name)
            
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
    #         serializer = ChennaiRoomsSerializers(room)
    #         return Response(serializer.data, status=200)

    #     except ChennaiRooms.DoesNotExist:
    #         return Response({'message': 'Room not found'}, status=404)
    #     except Exception as e:
    #         return Response({'message': str(e)}, status=400)
    @action(detail=False, methods=['post'])
    def bookroom(self, request):
        # CHANGE: Look for 'id' instead of 'room_name'
        room_id = request.data.get('id')
        
        try:
            # CHANGE: Filter by unique primary key ID
            room = ChennaiRooms.objects.get(id=room_id)
            
            room.check_and_reset()
            
            # Logic check: In your model, availability_status=False means AVAILABLE
            # If status is True, it is already occupied.
            if room.availability_status == False:
                return Response({'message': 'Room is already occupied'}, status=400)
            
            # Update the existing room row
            room.MainRoomName = request.data.get('MainRoom', 'Training Room')
            room.Occupied_by = request.data.get('occupied_by', 'Guest')
            room.OccuipedTiming = request.data.get('BookingTime')
            room.ReleaseTiming = request.data.get('ReleaseTime')
            room.availability_status = False  # Mark as occupied
            room.BookedBy = request.data.get('Bookedby', 'Employee')
            room.save()
            
            serializer = ChennaiRoomsSerializers(room)
            return Response(serializer.data, status=200)

        except ChennaiRooms.DoesNotExist:
            return Response({'message': 'Room not found'}, status=404)
        except Exception as e:
            # This catches the MultipleObjectsReturned error if you kept using room_name
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
