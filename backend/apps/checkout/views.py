# views.py
import datetime
import random
from decimal import Decimal

from apps.cart.models import Cart, CartItem
from apps.cart.serializers import CartItemSerializer
from apps.orders.models import Order, OrderProduct
from apps.profiles.models import Profile
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import CheckoutInitSerializer
from .utils import generate_order


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def checkout_api_view(request):
    cart_items = CartItem.objects.filter(cart__user=request.user)
    cart_count = cart_items.count()

    if cart_count <= 0:
        return Response(
            {"detail": "Cart is empty. Redirect to marketplace."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user_profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response(
            {"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND
        )

    default_data = {
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "phone_number": user_profile.phone_number,
        "address": user_profile.address,
        "state": user_profile.state,
        "city": user_profile.city,
    }

    checkout_info = CheckoutInitSerializer(default_data)
    cart_data = CartItemSerializer(cart_items, many=True)

    return Response(
        {
            "checkout_info": checkout_info.data,
            "cart_items": cart_data.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout_post_api_view(request):
    serializer = CheckoutInitSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart_items = CartItem.objects.filter(cart__user=request.user)

    if not cart_items.exists():
        return Response(
            {"detail": "Cart is empty. Cannot proceed with checkout."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = serializer.validated_data

    order_total = sum(item.product.price * item.quantity for item in cart_items)

    # Step 1: Create the Order (order_number added later)
    order = Order.objects.create(
        user=request.user,
        first_name=data["first_name"],
        last_name=data["last_name"],
        phone=data["phone_number"],
        email=data["email"],
        address_line=data["address"],
        country="Country Placeholder",
        state=data["state"],
        city=data["city"],
        pin_code="000000",
        order_note=data.get("order_note", ""),
        order_total=Decimal(order_total),
        payment_method=data.get("payment_method", "Card"),
        status="New",
        is_ordered=True,
    )

    # Step 2: Generate order_number after saving
    order.order_number = generate_order(order.pk)
    order.save()

    # Step 3: Create OrderProduct items
    for item in cart_items:
        OrderProduct.objects.create(
            order=order,
            user=request.user,
            product=item.product,
            quantity=item.quantity,
            product_price=item.product.price,
        )

    # Step 4: Clear the cart
    cart_items.delete()

    return Response(
        {
            "detail": "Order placed successfully.",
            "order_number": order.order_number,
            "order_total": str(order.order_total),
        },
        status=status.HTTP_201_CREATED,
    )
