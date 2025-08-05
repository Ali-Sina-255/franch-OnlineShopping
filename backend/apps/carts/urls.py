from django.urls import path

from .views import (
    CartApiView,
    CartDetailView,
    CartItemDeleteView,
    CartListView,
    CartTotalView,
    CheckoutAPIView,
    CreateOrderView,
    OrderDeleteAPIView,
    OrderDetailAPIView,
    PaymentSuccessView,
    ProductSalesStatsAPIView,
    ProductSalesSummaryListAPIView,
    WishlistAPIView,
    WishlistCreateAPIView,
)

urlpatterns = [
    path("cart/", CartApiView.as_view(), name="cart-create-update"),
    path("cart/<str:cart_id>/", CartListView.as_view(), name="cart-list"),
    path("cart/<str:cart_id>/total/", CartTotalView.as_view(), name="cart-total"),
    path("cart/<str:cart_id>/detail/", CartDetailView.as_view(), name="cart-detail"),
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
    path("checkout/<str:order_id>/", CheckoutAPIView.as_view(), name="checkout-view"),
    path("payment-success/", PaymentSuccessView.as_view(), name="payment-success"),
    path("orders/", OrderDetailAPIView.as_view(), name="list_orders"),
    path("orders/<int:pk>/delete/", OrderDeleteAPIView.as_view(), name="order-delete"),
    path(
        "wishlist/create/",
        WishlistCreateAPIView.as_view(),
        name="customer-wishlist-create",
    ),
    path(
        "wishlist/<user_id>/",
        WishlistAPIView.as_view(),
        name="customer-wishlist",
    ),
    path(
        "products/<int:product_id>/stats/",
        ProductSalesStatsAPIView.as_view(),
        name="product-sales-stats",
    ),
    path(
        "product-sales-summary/",
        ProductSalesSummaryListAPIView.as_view(),
        name="product-sales-summary",
    ),
]
