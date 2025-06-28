from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Brand, Product
from .pagination import CustomPageNumberPagination
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
    pagination_class = CustomPageNumberPagination
