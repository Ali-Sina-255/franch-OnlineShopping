from apps.carts.models import CartOrder
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, viewsets
from rest_framework.filters import SearchFilter
from rest_framework.parsers import FormParser, MultiPartParser

from .filters import ProductFilter
from .models import Brand, DeliveryCouriers, Product
from .pagination import CustomPageNumberPagination, ProductPageNumberPagination
from .serializers import BrandSerializer, DeliveryCouriersSerializer, ProductSerializer


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


class DeliveryCouriersListCreateView(generics.ListCreateAPIView):
    serializer_class = DeliveryCouriersSerializer

    def get_queryset(self):
        order_id = self.kwargs.get("order_id")
        # Filter DeliveryCouriers for current user and CartOrder by oid
        return DeliveryCouriers.objects.filter(
            user=self.request.user, order__oid=order_id
        )

    def perform_create(self, serializer):
        order_id = self.kwargs.get("order_id")
        try:
            order = CartOrder.objects.get(oid=order_id)
        except CartOrder.DoesNotExist:
            raise Http404(f"Order with oid '{order_id}' not found")

        serializer.save(user=self.request.user, order=order)
