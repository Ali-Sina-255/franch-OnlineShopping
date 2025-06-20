from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import serializers

from apps.product.models import Product
from apps.product.serializers import ProductSerializer

from .models import Cart, CartItem

User = get_user_model()
import uuid


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product"
    )

    class Meta:
        model = CartItem
        fields = ["id", "product_id", "product", "quantity", "total_price", "is_active"]

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price


class CartSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False
    )
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "cart_id",
            "user",
            "created_at",
            "updated_at",
            "total_items",
            "total_price",
        ]

    def get_total_items(self, cart):
        return cart.items.aggregate(total=Coalesce(Sum("quantity"), Value(0)))["total"]

    def get_total_price(self, cart):
        return cart.items.annotate(
            line_total=F("quantity") * F("product__price")
        ).aggregate(total=Coalesce(Sum("line_total"), Value(0)))["total"]

    def create(self, validated_data):
        user = self.context["request"].user
        return super().create({**validated_data, "user": user})
