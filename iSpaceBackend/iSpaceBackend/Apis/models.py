from django.db import models
import datetime





class admin(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)


class Employees(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email =models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    mobile = models.CharField(max_length=255)
    gender = models.CharField(max_length=255)
    address =models.CharField(max_length=255)
    status = models.IntegerField()
    posting_date = models.TimeField()
    managerAccess = models.BooleanField(default=False)
    

from django.db import models
from django.utils import timezone
import datetime

class ChennaiRooms(models.Model):
    id = models.AutoField(primary_key=True)
    MainRoomName = models.CharField(max_length=255, default="")
    room_name = models.CharField(max_length=255,default="TR1")
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    availability_status = models.BooleanField(default=False)
    datetime = models.DateTimeField(default=datetime.datetime.now)
    Occupied_by = models.CharField(max_length=255, null=True, blank=True)
    OccuipedTiming = models.CharField(max_length=255, null=True, blank=True)
    ReleaseTiming = models.CharField(max_length=255, null=True, blank=True)
    BookedBy = models.CharField(max_length=255, null=True, blank=True)
    FutureBookings = models.JSONField(default=list, null=True, blank=True)
    def save(self, *args, **kwargs):
        """
        Custom save method: If it's a new booking, we can log it here.
        If it's an update, it just saves normally.
        """
        super(ChennaiRooms, self).save(*args, **kwargs)


    # def check_and_reset(self):
    #     print(f"DEBUG: Checking room {self.availability_status} for reset.")
    #     if self.availability_status and self.ReleaseTiming  and self.ReleaseTiming not in ["N/A", ""]:
    #         try:
    #             from django.utils import timezone
    #             import datetime
    #             print("hii")

    #         # 1. Get current time in the local timezone (not UTC)
    #             now_local = timezone.localtime(timezone.now())
    #             current_time = now_local.time()

                

    #         # 2. Convert ReleaseTiming string "HH:MM" to a time object
    #             release_time_obj = datetime.datetime.strptime(self.ReleaseTiming, "%H:%M").time()
    #             print(current_time)
    #             print(release_time_obj)

    #         # 3. Precise comparison
    #             if current_time >= release_time_obj:
                    
    #                 BookingHistory.objects.create(
    #                 room_name=self.room_name,
    #                 main_room_name=self.MainRoomName,
    #                 booked_by=self.BookedBy,
    #                 occupied_by=self.Occupied_by,
    #                 start_time=self.OccuipedTiming,
    #                 end_time=self.ReleaseTiming
    #             )
    #                 print("hello")
    #                 self.availability_status = False  # Set back to Available
    #                 self.Occupied_by = "N/A"
    #                 self.OccuipedTiming = "N/A"
    #                 self.ReleaseTiming = "N/A"
    #                 self.save()
    #                 print(f"DEBUG: {self.room_name} has been reset.")
                
    #         except ValueError as e:
    #             # Handle cases where ReleaseTiming format is wrong
    #             print(f"Time format error: {e}")
    def check_and_reset(self):
        # We only check rooms that are currently marked as occupied
        if self.availability_status and self.ReleaseTiming and self.ReleaseTiming not in ["N/A", ""]:
            try:
                from django.utils import timezone
                import datetime

                # 1. Get current local time
                now_local = timezone.localtime(timezone.now())
                current_time = now_local.time()

                # 2. Convert ReleaseTiming string "HH:MM" to a time object
                release_time_obj = datetime.datetime.strptime(self.ReleaseTiming, "%H:%M").time()
                print("ganesh1")

                # 3. Check if the booking has expired
                if current_time >= release_time_obj:
                    print("ganesh")
                    # A. LOG TO HISTORY: Save the booking that just finished
                    BookingHistory.objects.create(
                        BookingType =  "RoomBooking",
                        room_name=self.room_name,
                        main_room_name=self.MainRoomName,
                        booked_by=self.BookedBy,
                        occupied_by=self.Occupied_by,
                        start_time=self.OccuipedTiming,
                        end_time=self.ReleaseTiming,
                        location= self.location
                        
                    )

                    # B. QUEUE LOGIC: Check if someone is waiting in the FutureBookings list
                    if self.FutureBookings and len(self.FutureBookings) > 0:
                        # Pop the first person from the list
                        next_booking = self.FutureBookings.pop(0)

                        # Promote them to current occupant
                        self.Occupied_by = next_booking.get('occupied_by')
                        self.OccuipedTiming = next_booking.get('BookingTime')
                        self.ReleaseTiming = next_booking.get('ReleaseTime')
                        self.BookedBy = next_booking.get('Bookedby')
                        self.availability_status = True # Stay occupied for the next person
                    else:
                        # No one is waiting, reset fields to empty
                        self.availability_status = False
                        self.Occupied_by = "N/A"
                        self.OccuipedTiming = "N/A"
                        self.ReleaseTiming = "N/A"
                        self.BookedBy = "N/A"

                    # 4. Save the changes to the database
                    self.save()
                    print(f"DEBUG: {self.room_name} processed. Queue size now: {len(self.FutureBookings) if self.FutureBookings else 0}")

            except Exception as e:
                print(f"Error in check_and_reset for {self.room_name}: {e}")

class BookingHistory(models.Model):
    BookingType = models.CharField(max_length=255,default="None")
    room_name = models.CharField(max_length=255)
    main_room_name = models.CharField(max_length=255)
    booked_by = models.CharField(max_length=255)
    occupied_by = models.CharField(max_length=255)
    start_time = models.CharField(max_length=255)
    end_time = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)
    location = models.CharField(max_length=255,default="Chennai")


class BangaloreRooms(models.Model):
    id = models.AutoField(primary_key=True)
    MainRoomName = models.CharField(max_length=255, default="")
    room_name = models.CharField(max_length=255,default="TR1")
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    availability_status = models.BooleanField(default=False)
    datetime = models.DateTimeField(default=datetime.datetime.now)
    Occupied_by = models.CharField(max_length=255, null=True, blank=True)
    OccuipedTiming = models.CharField(max_length=255, null=True, blank=True)
    ReleaseTiming = models.CharField(max_length=255, null=True, blank=True)
    BookedBy = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        """
        Custom save method: If it's a new booking, we can log it here.
        If it's an update, it just saves normally.
        """
        super(BangaloreRooms, self).save(*args, **kwargs)

    def check_and_reset(self):
        """
        Compares current time with ReleaseTiming string.
        Resets fields if time has expired.
        """
        if not self.availability_status and self.ReleaseTiming and self.ReleaseTiming != "N/A":
            try:
                # Convert string "HH:MM" (like "14:30") to a time object
                current_time = timezone.now().time()
                release_time_obj = datetime.datetime.strptime(self.ReleaseTiming, "%H:%M").time()

                if current_time >= release_time_obj:
                    self.availability_status = True
                    self.Occupied_by = "N/A"
                    self.OccuipedTiming = "N/A"
                    self.ReleaseTiming = "N/A"
                    self.save()
            except ValueError:
                # In case the time string is in a different format
                pass

class MeetingRoom(models.Model):
    id = models.AutoField(primary_key=True)
    room_name = models.CharField(max_length=255)
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    availability_status = models.BooleanField(default=True)
    datetime = models.DateTimeField(default=datetime.datetime.now)
    Occupied_by = models.CharField(max_length=255, null=True, blank=True)
    OccuipedTiming= models.CharField(max_length=255, null=True, blank=True)
    ReleaseTiming= models.CharField(max_length=255, null=True, blank=True)

class ProjectRomm(models.Model):
    id = models.AutoField(primary_key=True)
    room_name = models.CharField(max_length=255)
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    availability_status = models.BooleanField(default=True)
    datetime = models.DateTimeField(default=datetime.datetime.now)
    Occupied_by = models.CharField(max_length=255, null=True, blank=True)
    OccuipedTiming= models.CharField(max_length=255, null=True, blank=True)
    ReleaseTiming= models.CharField(max_length=255, null=True, blank=True)

class ConferenceRoom(models.Model):
    id = models.AutoField(primary_key=True)
    room_name = models.CharField(max_length=255)
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    availability_status = models.BooleanField(default=True)
    datetime = models.DateTimeField(default=datetime.datetime.now)
    Occupied_by = models.CharField(max_length=255, null=True, blank=True)
    OccuipedTiming= models.CharField(max_length=255, null=True, blank=True)
    ReleaseTiming= models.CharField(max_length=255, null=True, blank=True)



class OfficeSeat(models.Model):
    seat_id = models.CharField(max_length=20, primary_key=True) # e.g., B1-S1
    block = models.CharField(max_length=50, default="Block 1")
    is_available = models.BooleanField(default=True)
    
    # Booking Info
    booked_by_name = models.CharField(max_length=255, null=True, blank=True)
    booked_by_email = models.EmailField(null=True, blank=True)
    team_name = models.CharField(max_length=100, null=True, blank=True)
    
    # Timings
    booking_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    release_time = models.TimeField(null=True, blank=True)
    FutureBookings = models.JSONField(default=list, null=True, blank=True)
    def next_booking_to_time(self,time_str):
        """Helper to convert 'HH:MM' string to a python time object"""
        if not time_str or time_str == "N/A":
            return None
        try:
            # Converts "14:30" string to a datetime object, then extracts the time
            return datetime.datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            return None
    def next_booking_to_date(self,date_str):
        """Helper to convert 'YYYY-MM-DD' string to a python date object"""
        if not date_str or date_str in ["", "N/A"]:
            return None
        try:
            # Converts "2026-01-24" string to a date object
            return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return None
    def check_and_release(self):
        """Automatically releases the seat or promotes the next person in queue."""
        if not self.is_available and self.release_time:
            now = timezone.localtime(timezone.now()).time()
            now_local = timezone.localtime(timezone.now())
            current_time = now_local.time()

            # release_time_obj = datetime.datetime.strptime(self.release_time, "%H:%M").time()
            if current_time >= self.release_time:
                    # A. LOG TO HISTORY: Save the booking that just finished
                    BookingHistory.objects.create(
                        BookingType =  "SeatBooking",
                        room_name=self.block,
                        main_room_name=self.seat_id,
                        booked_by=self.booked_by_name,
                        occupied_by=self.booked_by_email,
                        start_time=self.start_time or "N/A",
                        end_time=self.release_time,
                    )

            if now >= self.release_time:
                # QUEUE LOGIC
                if self.FutureBookings and len(self.FutureBookings) > 0:
                    next_b = self.FutureBookings.pop(0)
                    self.booked_by_name = next_b.get('booked_by_name')
                    self.booked_by_email = next_b.get('booked_by_email')
                    self.team_name = next_b.get('team_name')
                    # self.booking_date = next_b.get('booking_date')
                    
                    # Use the helper function here
                    self.booking_date = self.next_booking_to_date(next_b.get('booking_date'))
                    self.start_time = self.next_booking_to_time(next_b.get('start_time'))
                    self.release_time = self.next_booking_to_time(next_b.get('release_time'))
                    
                    self.is_available = False
                else:
                    # No one waiting, reset seat
                    self.is_available = True
                    self.booked_by_name = None
                    self.booked_by_email = None
                    self.team_name = None
                    self.release_time = None
                    self.start_time = None
                    self.booking_date = None
                
                self.save()
    def __str__(self):
        return f"{self.seat_id} - {'Available' if self.is_available else 'Occupied'}"










    




