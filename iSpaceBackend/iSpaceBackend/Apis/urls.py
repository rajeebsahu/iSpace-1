from django.contrib import admin
from django.urls import path,include

from Apis.views import adminViewSet,EmployeeViewSet,ChennaiRoomViewSet,BangaloreRoomViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'admin',adminViewSet)
router.register(r'Employees',EmployeeViewSet)
router.register(r'ChennaiRoom',ChennaiRoomViewSet)
router.register(r'BangaloreRoom',BangaloreRoomViewSet)
urlpatterns = [
    path('',include(router.urls))
]
