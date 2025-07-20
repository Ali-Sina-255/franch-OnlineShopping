from django.contrib.auth import get_user_model
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
    total_price = serializers.SerializerMethodField(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product"
    )

    class Meta:
        model = CartItem
        fields = ["id", "cart", "product_id", "product", "quantity", "total_price", "is_active"]
        read_only_fields = ['cart'] 

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(
        read_only=True 
    )
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    

    class Meta:
        model = Cart
        fields = [
            "cart_id",
            "user",
            "items",
            "created_at",
            "updated_at",
            "total_items",
            "total_price",
        ]

    def get_total_items(self, cart):
        return cart.items.filter(is_active=True).aggregate(total=Coalesce(Sum("quantity"), Value(0)))["total"]

    def get_total_price(self, cart):
        total = cart.items.filter(is_active=True).aggregate(
            total_price=Sum(F('quantity') * F('product__price'))
        )['total_price']
        return total or 0