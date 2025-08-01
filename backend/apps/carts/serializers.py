from decimal import Decimal

from apps.product.models import DeliveryCouriers, Product
from apps.product.serializers import ProductSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Cart, CartOrder, CartOrderItem, Wishlist

User = get_user_model()
# Define a serializer for the CartOrderItem model


class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_available=True),
        source="product",
        write_only=True,
    )
    qty = serializers.IntegerField(required=True, min_value=1)  # ✅ Add this

    class Meta:
        model = Cart
        fields = ["id", "product", "product_id", "qty", "total", "cart_id", "date"]
        read_only_fields = ["total", "cart_id", "date", "product"]

    def validate_qty(self, value):
        prod = None
        if self.initial_data.get("product_id"):
            prod = Product.objects.filter(id=self.initial_data["product_id"]).first()
        elif self.instance:
            prod = self.instance.product
        if prod and value > prod.stock:
            raise serializers.ValidationError(
                f"Only {prod.stock} in stock, you requested {value}."
            )
        return value

    def create(self, validated_data):
        # Automatically assign the authenticated user
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


# Define a serializer for the CartOrderItem model
class CartOrderItemSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()

    class Meta:
        model = CartOrderItem
        fields = [
            "id",
            "oid",
            "order",
            "product",
            "qty",
            "price",
            "sub_total",
            "total",
            "date",
        ]

    def __init__(self, *args, **kwargs):
        super(CartOrderItemSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get("request")
        if request and request.method == "POST":
            # When creating a new cart order item, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3


# Define a serializer for the CartOrder model
class CartOrderSerializer(serializers.ModelSerializer):
    orderitem = CartOrderItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartOrder
        fields = [
            "id",
            "user",
            "total",
            "payment_status",
            "order_status",
            "full_name",
            "email",
            "mobile",
            "address",
            "city",
            "state",
            "country",
            "oid",
            "date",
            "orderitem",
        ]

    def get_total(self, obj):
        """
        Calculates order total plus delivery cost.
        """
        base = obj.calculate_total()
        delivery = obj.deliverycouriers_set.last()
        if delivery:
            cost = delivery.calculate_delivery_cost()
        else:
            cost = Decimal("0.00")
        return base + cost

    # def get_grand_total(self, obj):
    #     base = Decimal(obj.total or 0)
    #     try:
    #         delivery = obj.deliverycouriers_set.latest("created_at").delivery_cost
    #     except (DeliveryCouriers.DoesNotExist, AttributeError):
    #         delivery = Decimal("0")
    #     return base + delivery


class WishlistCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_available=True), write_only=True
    )
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product_id", "product"]


class ProductSalesSummarySerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    total_sales = serializers.FloatField()
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_returns = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_returns = serializers.IntegerField()
