from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import generics, permissions

from .models import Notification
from .serializers import NotificationSerializer

User = get_user_model()


def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item,
    )


class CustomerNotificationView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        return Notification.objects.filter(user=user)
