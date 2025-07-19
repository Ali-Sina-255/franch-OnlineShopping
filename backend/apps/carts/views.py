from decimal import Decimal

import requests
from apps.carts.models import Cart
from apps.product.models import Product
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from loguru import logger
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Cart, CartOrder, CartOrderItem
from .serializers import CartOrderItem, CartOrderSerializer, CartSerializer
from .utils import send_payment_success_email

User = get_user_model()


# from .serializers import CartSerializer


class CartApiView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only carts of the logged-in user
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None
        product = get_object_or_404(Product, id=request.data.get("product_id"))
        qty = int(request.data.get("qty", 1))

        cart_qs = Cart.objects.filter(user=user, product=product)

        if cart_qs.exists():
            cart = cart_qs.first()
            cart.qty += qty  # increment quantity
            cart.save()
            created = False
        else:
            cart = Cart.objects.create(user=user, product=product, qty=qty)
            created = True

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status_code)


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        user_id = self.kwargs.get("user_id")

        if user_id:
            user = get_object_or_404(User, id=user_id)
            return Cart.objects.filter(cart_id=cart_id, user=user)
        return Cart.objects.filter(cart_id=cart_id)


class CartTotalView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        user_id = self.kwargs.get("user_id")

        if user_id:
            user = get_object_or_404(User, id=user_id)
            return Cart.objects.filter(cart_id=cart_id, user=user)
        return Cart.objects.filter(cart_id=cart_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total = sum([cart.total for cart in queryset])
        total_qty = sum([cart.qty for cart in queryset])

        return Response(
            {"total_amount": round(float(total), 2), "total_items": total_qty}
        )


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    lookup_field = "cart_id"
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        user_id = self.kwargs.get("user_id")

        if user_id:
            user = get_object_or_404(User, id=user_id)
            return Cart.objects.filter(cart_id=cart_id, user=user)
        return Cart.objects.filter(cart_id=cart_id)


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = "cart_id"

    def get_object(self):
        cart_id = self.kwargs["cart_id"]
        item_id = self.kwargs["item_id"]
        user_id = self.kwargs.get("user_id")

        if user_id:
            user = get_object_or_404(User, id=user_id)
            return get_object_or_404(Cart, cart_id=cart_id, id=item_id, user=user)
        return get_object_or_404(Cart, cart_id=cart_id, id=item_id)


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = [IsAuthenticated]  # require login

    def create(self, request, *args, **kwargs):
        user = request.user  # always use the logged-in user
        data = request.data
        cart_id = data.get("cart_id")

        cart_items = Cart.objects.filter(cart_id=cart_id, user=user)
        if not cart_items.exists():
            return Response(
                {"detail": "Cart is empty or invalid cart_id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prepare order fields
        order_data = {
            "user": user,
            "full_name": data.get("full_name"),
            "email": data.get("email"),
            "mobile": data.get("mobile"),
            "address": data.get("address"),
            "city": data.get("city"),
            "state": data.get("state"),
            "country": data.get("country"),
            "payment_status": "processing",
        }

        with transaction.atomic():
            order = CartOrder.objects.create(**order_data)

            total = Decimal(0)
            for item in cart_items:
                CartOrderItem.objects.create(
                    order=order,
                    product=item.product,
                    qty=item.qty,
                    price=item.product.price,
                    sub_total=item.total,
                    total=item.total,
                )
                total += item.total

            order.total = total
            order.save()

        return Response(
            {"message": "Order Created Successfully", "order_oid": order.oid},
            status=status.HTTP_201_CREATED,
        )


class CheckoutAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = "order_id"

    def get_object(self):
        order_id = self.kwargs["order_id"]
        order = CartOrder.objects.get(oid=order_id)

        return order


def get_access_token(client_id, secret_key):
    # Function to get access token from PayPal API
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {"grant_type": "client_credentials"}
    auth = (client_id, secret_key)
    response = requests.post(token_url, data=data, auth=auth)

    if response.status_code == 200:
        print("access_token ====", response.json()["access_token"])
        return response.json()["access_token"]
    else:
        raise Exception(
            f"Failed to get access token from PayPal. Status code: {response.status_code}"
        )


class PaymentSuccessView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        payload = request.data
        order_oid = payload["order_oid"]
        payapl_order_id = payload["payapl_order_id"]

        try:
            order = CartOrder.objects.get(oid=order_oid)
        except CartOrder.DoesNotExist:
            return Response(
                {"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if payapl_order_id != "null":
            paypal_api_url = (
                f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{payapl_order_id}"
            )
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {get_access_token(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET_ID)}",
            }
            response = requests.get(paypal_api_url, headers=headers)

            if response.status_code == 200:
                paypal_order_data = response.json()
                paypal_payment_status = paypal_order_data["status"]

                if paypal_payment_status == "COMPLETED":
                    if order.payment_status == "processing":
                        order.payment_status = "paid"
                        order.save()

                        # ✅ Send payment success email
                        try:
                            send_payment_success_email(order)
                        except Exception as e:
                            logger.warning(f"Failed to send email: {str(e)}")

                        return Response(
                            {"message": "Payment Successful"},
                            status=status.HTTP_201_CREATED,
                        )

                    return Response(
                        {"message": "Already Paid"}, status=status.HTTP_200_OK
                    )

                return Response(
                    {"message": f"Payment status is '{paypal_payment_status}'"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"message": "Failed to verify PayPal payment"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "No valid PayPal order ID provided"},
            status=status.HTTP_400_BAD_REQUEST,
        )
