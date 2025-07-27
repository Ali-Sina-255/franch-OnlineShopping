from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("product", views.ProductViewSet, basename="product")

urlpatterns = [
    path("brand/", views.BrandAPIViewSet.as_view(), name="brand"),
    path(
        "delivery-couriers/<str:order_id>/",
        views.DeliveryCouriersListCreateView.as_view(),
        name="delivery-couriers-list-create",
    ),
    path("", include(router.urls)),
]
