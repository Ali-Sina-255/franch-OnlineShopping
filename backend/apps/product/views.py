from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.filters import SearchFilter
from .filters import ProductFilter
from .models import Brand, Product
from .pagination import CustomPageNumberPagination, ProductPageNumberPagination
from .serializers import BrandSerializer, ProductSerializer


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
    search_fields = ['product_name', 'tags__name', 'details__icontains', 'condition', 'description']
    
    