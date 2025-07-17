from django.urls import path

from .views import (
    CartApiView,
    CartDetailView,
    CartItemDeleteView,
    CartListView,
    CartTotalView,
    CreateOrderView,
)

urlpatterns = [
    # Create or update a cart item
    path("cart/", CartApiView.as_view(), name="cart-create-update"),
    # Get all items for a specific cart ID (with optional user)
    path("cart/<str:cart_id>/", CartListView.as_view(), name="cart-list"),
    # Get total for a specific cart ID (with optional user)
    path("cart/<str:cart_id>/total/", CartTotalView.as_view(), name="cart-total"),
    # Get cart detail (aggregated summary)
    path("cart/<str:cart_id>/detail/", CartDetailView.as_view(), name="cart-detail"),
    # Delete a specific cart item by item ID and cart ID
    path(
        "cart/<str:cart_id>/delete/<int:item_id>/",
        CartItemDeleteView.as_view(),
        name="cart-item-delete",
    ),
    path(
        "cart/<str:cart_id>/delete/<int:item_id>/<int:user_id>/",
        CartItemDeleteView.as_view(),
        name="cart-item-delete-user",
    ),
    path("orders/create/", CreateOrderView.as_view(), name="create-order"),
]
