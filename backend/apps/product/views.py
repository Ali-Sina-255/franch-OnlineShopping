from apps.carts.models import CartOrder
from django.http import Http404
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import NotFound
from rest_framework.filters import SearchFilter
from rest_framework.parsers import FormParser, MultiPartParser

from .filters import ProductFilter
from .models import Brand, DeliveryCouriers, Product
from .pagination import CustomPageNumberPagination, ProductPageNumberPagination
from .serializers import (
    BrandSerializer,
    DeliveryCouriersCreateSerializer,
    DeliveryCouriersSerializer,
    ProductSerializer,
)
from .tasks import process_new_product


class BrandAPIViewSet(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [permissions.IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = ProductPageNumberPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ProductFilter
    search_fields = [
        "product_name",
        "tags__name",
        "details__icontains",
        "condition",
        "description",
    ]

    def perform_create(self, serializer):
        product = serializer.save()
        process_new_product.delay(product.id)


class DeliveryCourierCreateView(generics.CreateAPIView):
    serializer_class = DeliveryCouriersCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    lookup_field = "oid"
    lookup_url_kwarg = "order_oid"
    queryset = CartOrder.objects.all()

    def perform_create(self, serializer):
        order = get_object_or_404(
            CartOrder, oid=self.kwargs["order_oid"], user=self.request.user
        )
        delivery = serializer.save(user=self.request.user, cart_order=order)

        # Calculate and update the delivery cost
        delivery_cost = delivery.calculate_delivery_cost()
        delivery.delivery_cost = delivery_cost
        delivery.save(update_fields=["delivery_cost"])

        # Update the CartOrder total
        order.total += delivery_cost
        order.save(update_fields=["total"])


class DeliveryCourierDetailView(generics.RetrieveAPIView):
    queryset = DeliveryCouriers.objects.all()
    serializer_class = DeliveryCouriersSerializer
    serializer_class = DeliveryCouriersSerializer
