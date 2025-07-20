from django.urls import path

from . import views

urlpatterns = [
    path(
        "notification/<user_id>/",
        views.CustomerNotificationView.as_view(),
        name="customer-notification",
    ),
    path("contacts/", views.ContactCreateAPIView.as_view(), name="contact-create"),
    path(
        "contacts/<int:pk>/",
        views.ContactDeleteAPIView.as_view(),
        name="contact-delete",
    ),
]
