from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from apps.carts.models import Cart
from apps.product.models import Product

from .models import Cart, CartOrder, CartOrderItem
from .serializers import CartOrderItem, CartOrderSerializer, CartSerializer

User = get_user_model()


from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.product.models import Product

# from .serializers import CartSerializer


class CartApiView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None
        product = get_object_or_404(Product, id=request.data.get("product_id"))
        qty = int(request.data.get("qty", 1))

        cart, created = Cart.objects.update_or_create(
            user=user, defaults={"product": product, "qty": qty}
        )

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
