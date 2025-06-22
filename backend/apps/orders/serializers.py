from decimal import Decimal

from apps.product.models import Product
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from .models import Order, OrderProduct, Payment

User = get_user_model()


class PaymentSerializer(serializers.ModelSerializer):
    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Payment
        fields = [
            "id",
            "user",
            "payment_id",
            "payment_method",
            "amount_paid",
            "status",
            "created_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment = PaymentSerializer(read_only=True)
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=CurrentUserDefault()
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "payment",
            "order_number",
            "first_name",
            "last_name",
            "phone",
            "email",
            "address_line_1",
            "address_line_2",
            "country",
            "state",
            "city",
            "order_note",
            "order_total",
            "tax",
            "status",
            "ip",
            "is_ordered",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)


class OrderProductSerializer(serializers.ModelSerializer):
    product_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderProduct
        fields = [
            "id",
            "order",
            "payment",
            "user",
            "product",
            "quantity",
            "total_price",
            "product_price",
            "ordered",
            "created_at",
            "updated_at",
        ]

    def get_total_price(self, obj):
        return obj.quantity * obj.product_price
