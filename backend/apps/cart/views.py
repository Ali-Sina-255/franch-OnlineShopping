import uuid

from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.annotate(
            total_items=Coalesce(Sum("items__quantity"), Value(0)),
            total_price=Coalesce(
                Sum(F("items__quantity") * F("items__product__price")),
                Value(0),
            ),
        )

    def perform_create(self, serializer):
        user = self.request.user
        if Cart.objects.filter(user=user).exists():
            raise ValidationError("Cart already exists for this user.")
        serializer.save()


class CartItemListCreateView(generics.ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cart = Cart.objects.get(cart_id=self.request.data["cart_id"])
        serializer.save(cart=cart)
