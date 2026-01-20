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
        super(ChennaiRooms, self).save(*args, **kwargs)

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










    




