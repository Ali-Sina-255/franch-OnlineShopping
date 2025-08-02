from decimal import Decimal

import requests
from apps.carts.models import Cart
from apps.carts.permission import IsAdminOrOwner
from apps.product.models import Product
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models, transaction
from django.db.models import Count, DecimalField, F, IntegerField, Q, Sum, Value
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from loguru import logger
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartOrder, CartOrderItem, Wishlist
from .serializers import (
    CartOrderItem,
    CartOrderSerializer,
    CartSerializer,
    ProductSalesSummarySerializer,
    WishlistCreateSerializer,
)
from .utils import send_payment_success_email

User = get_user_model()


class CartApiView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only carts of the logged-in user
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        user = request.user
        data["product_id"] = data.get("product_id")

        # Use serializer to validate
        serializer = self.get_serializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data["product"]
        qty = serializer.validated_data["qty"]

        # If cart exists, update qty
        cart_qs = Cart.objects.filter(user=user, product=product)
        if cart_qs.exists():
            cart = cart_qs.first()
            new_qty = cart.qty + qty
            if new_qty > product.stock:
                return Response(
                    {"qty": f"Total quantity {new_qty} exceeds stock {product.stock}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart.qty = new_qty
            cart.save()
            created = False
        else:
            cart = serializer.save(user=user)
            created = True

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(
            CartSerializer(cart, context={"request": request}).data, status=status_code
        )


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


class OrderDeleteAPIView(generics.DestroyAPIView):
    queryset = CartOrder.objects.all()
    serializer_class = CartOrderSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

class OrderDetailAPIView(generics.GenericAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    queryset = CartOrder.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user

        if user.is_staff:
            orders = CartOrder.objects.all().order_by("-date")  # Admin sees all
        else:
            orders = CartOrder.objects.filter(user=user).order_by("-date")  # Regular user sees only their own

        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
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
                        # if order.user is not None:
                        #     send_notification(user=order.user, order=order)
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


class WishlistCreateAPIView(generics.CreateAPIView):
    serializer_class = WishlistCreateSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product_id"]
        user = request.user

        existing = Wishlist.objects.filter(product=product, user=user)
        if existing.exists():
            existing.delete()
            return Response(
                {"message": "Removed from wishlist"}, status=status.HTTP_200_OK
            )

        Wishlist.objects.create(product=product, user=user)
        return Response(
            {"message": "Added to wishlist"}, status=status.HTTP_201_CREATED
        )


class WishlistAPIView(generics.ListAPIView):
    serializer_class = WishlistCreateSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        wishlist = Wishlist.objects.filter(
            user=user,
        )
        return wishlist


class ProductSalesStatsAPIView(APIView):
    def get(self, request, product_id):
        # Filter order items with the given product
        order_items = CartOrderItem.objects.filter(product_id=product_id)

        # Filter only orders that are paid or fulfilled for sales and orders
        valid_orders = CartOrder.objects.filter(
            Q(payment_status="paid") | Q(order_status="Fulfilled")
        )

        # Order items linked to valid orders
        valid_order_items = order_items.filter(order__in=valid_orders)

        total_sales_agg = valid_order_items.aggregate(total_sales=Sum("total"))
        total_sales = total_sales_agg["total_sales"] or 0

        # Total orders with that product and valid status
        total_orders = (
            valid_orders.filter(orderitem__product_id=product_id).distinct().count()
        )

        # Total distinct customers who ordered the product
        total_customers = (
            valid_orders.filter(orderitem__product_id=product_id)
            .values("user_id")
            .distinct()
            .count()
        )

        # Calculate returns = orders with product which are cancelled or refunded
        returns_orders = (
            CartOrder.objects.filter(
                Q(order_status="Cancelled")
                | Q(payment_status__in=["refunded", "refunding"])
            )
            .filter(orderitem__product_id=product_id)
            .distinct()
        )

        total_returns = returns_orders.count()

        return Response(
            {
                "product_id": product_id,
                "total_sales": total_sales,
                "total_orders": total_orders,
                "total_customers": total_customers,
                "total_returns": total_returns,
            }
        )


class ProductSalesSummaryListAPIView(APIView):
    def get(self, request):
        # Annotate all products with aggregated sales/order info:
        products = Product.objects.all().annotate(
            total_sales=Coalesce(
                Sum(
                    "order_items__total",
                    filter=Q(order_items__order__order_status="Fulfilled")
                    & Q(order_items__order__payment_status="paid"),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                ),
                0,
                output_field=DecimalField(max_digits=12, decimal_places=2),
            ),
            total_orders=Coalesce(
                Count(
                    "order_items__order",
                    distinct=True,
                    filter=Q(order_items__order__order_status="Fulfilled")
                    & Q(order_items__order__payment_status="paid"),
                    output_field=IntegerField(),
                ),
                0,
                output_field=IntegerField(),
            ),
            total_customers=Coalesce(
                Count(
                    "order_items__order__user",
                    distinct=True,
                    filter=Q(order_items__order__order_status="Fulfilled")
                    & Q(order_items__order__payment_status="paid"),
                    output_field=IntegerField(),
                ),
                0,
                output_field=IntegerField(),
            ),
            total_returns=Coalesce(
                Count(
                    "order_items",
                    filter=Q(
                        order_items__order__order_status__in=["Cancelled", "Refunded"]
                    ),
                    output_field=IntegerField(),
                ),
                0,
                output_field=IntegerField(),
            ),
        )

        # Prepare response data and convert Decimal to float
        results = [
            {
                "product_id": product.id,
                "product_name": product.product_name,
                "total_sales": float(product.total_sales),
                "total_orders": product.total_orders,
                "total_customers": product.total_customers,
                "total_returns": product.total_returns,
            }
            for product in products
        ]

        serializer = ProductSalesSummarySerializer(results, many=True)
        return Response(serializer.data)
