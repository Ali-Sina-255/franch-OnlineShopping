from apps.product.models import Product
from apps.product.serializers import ProductSerializer
from rest_framework import serializers

from .models import Cart, CartOrder, CartOrderItem

# Define a serializer for the CartOrderItem model


class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Cart.objects.model.product.field.related_model.objects.filter(
            is_available=True
        ),
        source="product",
        write_only=True,
    )

    class Meta:
        model = Cart
        fields = [
            "id",
            "product",
            "product_id",
            "qty",
            "total",
            "cart_id",
            "date",
        ]
        read_only_fields = ["total", "cart_id", "date", "product"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        validated_data["user"] = user
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
