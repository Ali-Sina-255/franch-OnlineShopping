from django.urls import path

from .views import CartItemListCreateView, CartListCreateView, CartItemDetailView

urlpatterns = [
    path("cart/", CartListCreateView.as_view(), name="cart-list-create"),
    path("cart-items/", CartItemListCreateView.as_view(), name="cartitem-list-create"),
    path("cart-items/<int:pk>/", CartItemDetailView.as_view(), name="cartitem-detail"),
]