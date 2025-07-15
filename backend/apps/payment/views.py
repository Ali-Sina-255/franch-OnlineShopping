import os
from decimal import Decimal

import requests
from apps.cart.models import Cart, CartItem
from apps.orders.models import Order, OrderProduct, Payment
from apps.orders.serializers import OrderProductSerializer
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


def get_access_token(client_id, secret_id):
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = ({"grant_type": "client_credentials"},)
    auth = (client_id, secret_id)

    response = requests.post(token_url=token_url, data=data, auth=auth)
    if response.status_code == 200:
        print("Access Token :", response.json()["access_token"])
        return response.json()["access_token"]
    else:
        raise Exception(f"Failed to get access token: {response.status_code}")


class PaymentSuccessView(generics.CreateAPIView):
    serializer_class = OrderProductSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        payload = request.data

        order_id = payload.get("order_id")
        session_id = payload.get("session_id")
        paypal_order_id = payload.get("paypal_order_id")

        if not all([order_id, session_id, paypal_order_id]):
            return Response(
                {"error": "Missing required fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cart = Cart.objects.get(cart_id=order_id)
        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if paypal_order_id == "null":
            return Response(
                {"error": "Invalid PayPal order ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        access_token = get_access_token(settings.CLIENT_ID, settings.SECRET_KEY)

        paypal_order_url = (
            f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}"
        )
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        }

        response = requests.get(paypal_order_url, headers=headers)
        if response.status_code != 200:
            return Response(
                {"error": "Failed to verify PayPal order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        paypal_order_data = response.json()
        paypal_status = paypal_order_data.get("status")

        if paypal_status == "COMPLETED":
            # Assuming the Cart model has payment_status field (add if missing)
            if getattr(cart, "payment_status", "pending") == "pending":
                cart.payment_status = "paid"
                cart.save()

                # Create Order and Payment records here if needed
                # You might want to implement that logic

                # Optionally: send confirmation emails here

                return Response(
                    {"message": "Payment successful."}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"message": "Payment already completed."}, status=status.HTTP_200_OK
                )
        else:
            return Response(
                {"message": "Payment not completed yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )
