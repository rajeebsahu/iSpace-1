from django.contrib import admin
from django.urls import path,include

from Apis.views import adminViewSet,EmployeeViewSet,ChennaiRoomViewSet,SeatViewSet,BookingHistoryViewSet,BangaloreRoomViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'admin',adminViewSet)
router.register(r'Employees',EmployeeViewSet)
router.register(r'ChennaiRoom',ChennaiRoomViewSet)
router.register(r'BookingHistory',BookingHistoryViewSet)
router.register(r'BangaloreRoom',BangaloreRoomViewSet)
router.register(r'Seat',SeatViewSet)
urlpatterns = [
    path('',include(router.urls))
]
