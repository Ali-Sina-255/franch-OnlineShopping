# urls.py
from django.urls import path

from .views import checkout_api_view, checkout_post_api_view

urlpatterns = [
    path("checkout/", checkout_api_view, name="checkout-api"),
    path("checkout/submit", checkout_post_api_view, name="checkout-api-submit"),
]
