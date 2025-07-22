from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BrandAPIViewSet, ProductBrandListAPIView, ProductViewSet

router = DefaultRouter()
router.register("product", ProductViewSet, basename="product")

urlpatterns = [
    path("brand/", BrandAPIViewSet.as_view(), name="brand"),
    path("brands/", ProductBrandListAPIView.as_view(), name="product-brand-list"),
]
