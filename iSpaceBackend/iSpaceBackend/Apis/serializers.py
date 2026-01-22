
from rest_framework import serializers

from Apis.models import admin,Employees,ChennaiRooms,BookingHistory,OfficeSeat,BangaloreRooms,ProjectRomm,ConferenceRoom

class adminSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=admin
        fields ="__all__"

class EmployeesSerializers(serializers.ModelSerializer):
    class Meta:
        model=Employees
        fields ="__all__"
class ChennaiRoomsSerializers(serializers.ModelSerializer):
    class Meta:
        model=ChennaiRooms
        fields ="__all__"

class OfficeSeatSerializers(serializers.ModelSerializer):
    class Meta:
        model=OfficeSeat
        fields ="__all__"
# class SeatBlockSerializers(serializers.ModelSerializer):
#     class Meta:
#         model=SeatBlock
#         fields ="__all__"

class BookingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingHistory
        fields = "__all__"

class BangaloreRoomsSerializers(serializers.ModelSerializer):
    class Meta:
        model=BangaloreRooms
        fields ="__all__"
class ProjectRommSerializers(serializers.ModelSerializer):
    class Meta:
        model=ProjectRomm
        fields ="__all__"
class ConferenceRoomSerializers(serializers.ModelSerializer):
    class Meta:
        model=ConferenceRoom
        fields ="__all__"


