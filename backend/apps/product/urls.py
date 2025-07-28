from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("product", views.ProductViewSet, basename="product")

urlpatterns = [
    path("brand/", views.BrandAPIViewSet.as_view(), name="brand"),
    path(
        "delivery/<int:pk>/",
        views.DeliveryCourierDetailView.as_view(),
        name="delivery-detail",
    ),
    path(
        "delivery/create/<str:order_oid>/",
        views.DeliveryCourierCreateView.as_view(),
        name="delivery-create-by-order",
    ),
    path("", include(router.urls)),
]
