from rest_framework import generics

from .models import AttributeType, AttributeValue, Category
from .serializers import (
    AttributeTypeSerializer,
    AttributeValueSerializer,
    CategorySerializer,
)


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class AttributeTypeListView(generics.ListCreateAPIView):
    queryset = AttributeType.objects.select_related("category").all()
    serializer_class = AttributeTypeSerializer


class AttributeTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AttributeType.objects.select_related("category").all()
    serializer_class = AttributeTypeSerializer


class AttributeValueListView(generics.ListCreateAPIView):
    queryset = AttributeValue.objects.select_related("attribute").all()
    serializer_class = AttributeValueSerializer


class AttributeValueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AttributeValue.objects.select_related("attribute").all()
    serializer_class = AttributeValueSerializer
