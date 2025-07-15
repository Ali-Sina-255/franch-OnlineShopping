import re
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
        read_only_fields = ["created_at", "updated_at", "name"]

    def validate_phone(self, value):
        # Example: Ensure phone is digits and length between 10-15
        if not re.match(r"^\+?\d{10,15}$", value):
            raise serializers.ValidationError(
                "Phone number must be between 10 and 15 digits and may start with +"
            )
        return value

    def validate_pin_code(self, value):
        # Example: Pin code should be numeric and length 4-10
        if not value.isdigit() or not (4 <= len(value) <= 10):
            raise serializers.ValidationError(
                "Pin code must be numeric and between 4 to 10 digits"
            )
        return value

    def validate_payment_method(self, value):
        valid_methods = [choice[0] for choice in Order.PAYMENT_METHOD]
        if value not in valid_methods:
            raise serializers.ValidationError(
                f"Payment method must be one of: {', '.join(valid_methods)}"
            )
        return value

    def validate_status(self, value):
        valid_status = [choice[0] for choice in Order.STATUS]
        if value not in valid_status:
            raise serializers.ValidationError(
                f"Status must be one of: {', '.join(valid_status)}"
            )
        return value

    def validate(self, data):
        # Object-level validation
        if data.get("is_ordered") and not data.get("payment"):
            raise serializers.ValidationError(
                "Payment information must be provided if the order is marked as ordered."
            )

        # Example: email must belong to a certain domain (optional)
        # email = data.get('email')
        # if email and not email.endswith("@example.com"):
        #     raise serializers.ValidationError("Email must be from @example.com domain.")

        return data

    # def create(self, validated_data):
    #     user = self.context["request"].user
    #     validated_data["user"] = user
    #     return super().create(validated_data)


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
            "created_at",
            "updated_at",
        ]

    def get_total_price(self, obj):
        return obj.quantity * obj.product_price
