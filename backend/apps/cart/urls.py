from django.urls import path

from .views import CartItemListCreateView, CartListCreateView

urlpatterns = [
    path("cart-items/", CartItemListCreateView.as_view(), name="cartitem-list-create"),
    path("cart/", CartListCreateView.as_view(), name="cart-list-create"),
]
