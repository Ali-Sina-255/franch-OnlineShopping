from django.urls import path

from . import views

urlpatterns = [
    path(
        "notification/<user_id>/",
        views.CustomerNotificationView.as_view(),
        name="customer-notification",
    ),
]
