from django.urls import path

from .views import OrderListView, PaymentCreateView

urlpatterns = [
    path("payments/", PaymentCreateView.as_view(), name="payment-create"),
    path("orders/", OrderListView.as_view(), name="order-list"),
]
