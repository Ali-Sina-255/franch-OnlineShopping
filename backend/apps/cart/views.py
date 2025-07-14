import uuid

from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        if Cart.objects.filter(user=user).exists():
            raise ValidationError("Cart already exists for this user.")
        serializer.save(user=user)


class CartItemListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        cart, _ = Cart.objects.get_or_create(user=user)
        
        serializer.save(cart=cart)

class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)