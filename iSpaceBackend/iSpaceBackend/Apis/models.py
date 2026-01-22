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

# class TrainingRoom(models.Model):
#     id = models.AutoField(primary_key=True)
#     MainRoomName = models.CharField(max_length=255, default="")
#     room_name = models.CharField(max_length=255)
#     capacity = models.IntegerField()
#     location = models.CharField(max_length=255)
#     availability_status = models.BooleanField(default=True)
#     datetime = models.DateTimeField(default=datetime.datetime.now)
#     Occupied_by = models.CharField(max_length=255, null=True, blank=True)
#     OccuipedTiming= models.CharField(max_length=255, null=True, blank=True)
#     ReleaseTiming= models.CharField(max_length=255, null=True, blank=True)

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

    def save(self, *args, **kwargs):
        """
        Custom save method: If it's a new booking, we can log it here.
        If it's an update, it just saves normally.
        """
        super(ChennaiRooms, self).save(*args, **kwargs)


    def check_and_reset(self):
        print(f"DEBUG: Checking room {self.availability_status} for reset.")
        if self.availability_status and self.ReleaseTiming  and self.ReleaseTiming not in ["N/A", ""]:
            try:
                from django.utils import timezone
                import datetime
                print("hii")

            # 1. Get current time in the local timezone (not UTC)
                now_local = timezone.localtime(timezone.now())
                current_time = now_local.time()

                

            # 2. Convert ReleaseTiming string "HH:MM" to a time object
                release_time_obj = datetime.datetime.strptime(self.ReleaseTiming, "%H:%M").time()
                print(current_time)
                print(release_time_obj)

            # 3. Precise comparison
                if current_time >= release_time_obj:
                    
                    BookingHistory.objects.create(
                    room_name=self.room_name,
                    main_room_name=self.MainRoomName,
                    booked_by=self.BookedBy,
                    occupied_by=self.Occupied_by,
                    start_time=self.OccuipedTiming,
                    end_time=self.ReleaseTiming
                )
                    print("hello")
                    self.availability_status = False  # Set back to Available
                    self.Occupied_by = "N/A"
                    self.OccuipedTiming = "N/A"
                    self.ReleaseTiming = "N/A"
                    self.save()
                    print(f"DEBUG: {self.room_name} has been reset.")
                
            except ValueError as e:
                # Handle cases where ReleaseTiming format is wrong
                print(f"Time format error: {e}")
    

class BookingHistory(models.Model):
    room_name = models.CharField(max_length=255)
    main_room_name = models.CharField(max_length=255)
    booked_by = models.CharField(max_length=255)
    occupied_by = models.CharField(max_length=255) # Team Name
    start_time = models.CharField(max_length=255)
    end_time = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)


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

# class SeatBlock(models.Model):
#     name = models.CharField(max_length=50, unique=True, default="Block 1") # e.g., Block 1, Block 2
#     location_description = models.CharField(max_length=255, blank=True)

#     def __str__(self):
#         return self.name

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

    def check_and_release(self):
        """Automatically releases the seat if the time has passed."""
        if not self.is_available and self.release_time:
            now = timezone.localtime(timezone.now())
            if now.time() >= self.release_time:
                self.is_available = True
                self.booked_by_name = None
                self.release_time = None
                self.save()

    def __str__(self):
        return f"{self.seat_id} - {'Available' if self.is_available else 'Occupied'}"










    




