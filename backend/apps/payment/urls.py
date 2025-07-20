from django.urls import path

from .views import PaymentSuccessView

urlpatterns = [
    path("payment/", PaymentSuccessView.as_view(), name="payment"),
]
