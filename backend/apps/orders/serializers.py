import re
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.product.models import Product

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
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    payment = serializers.PrimaryKeyRelatedField(
        allow_null=True, required=False, queryset=Payment.objects.all()
    )

    status_display = serializers.CharField(source="get_status_display", read_only=True)
    payment_method_display = serializers.CharField(
        source="get_payment_method_display", read_only=True
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
            "address_line",
            "country",
            "state",
            "city",
            "pin_code",
            "order_note",
            "order_total",
            "payment_method",
            "payment_method_display",
            "status",
            "status_display",
            "is_ordered",
            "created_at",
            "updated_at",
            "name",
        ]
        read_only_fields = ["user", "created_at", "updated_at", "name", "order_number"]

    def validate_phone(self, value):
        if not re.match(r"^\+?\d{10,15}$", value):
            raise serializers.ValidationError(
                "Phone number must be between 10 and 15 digits and may start with +"
            )
        return value

    def validate_pin_code(self, value):
        if not value.isdigit() or not (4 <= len(value) <= 10):
            raise serializers.ValidationError(
                "Pin code must be numeric and between 4 to 10 digits"
            )
        return value

    def validate(self, data):
        if data.get("is_ordered") and not data.get("payment"):
            raise serializers.ValidationError(
                "Payment information must be provided if the order is marked as ordered."
            )
        return data

    def create(self, validated_data):
        # The user is derived from the authenticated request, not sent in the payload.
        user = self.context["request"].user
        
        # This logic should be expanded to include creating OrderProduct items from the cart.
        # For now, it correctly creates the Order shell with the right user.
        order = Order.objects.create(user=user, **validated_data)
        return order


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