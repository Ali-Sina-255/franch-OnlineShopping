import django_filters
from taggit.models import Tag
from taggit.serializers import TagListSerializerField

from .models import Product

class ProductFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    condition = django_filters.CharFilter(field_name="condition")
    type = django_filters.CharFilter(field_name="type")
    attributes = django_filters.CharFilter(method="filter_attributes")
    tags = django_filters.CharFilter(method="filter_tags")
    def filter_attributes(self, queryset, name, value):
        from django.db.models import Q
        filters = Q()
        for item in value.split(","):
            if ":" in item:
                key, val = item.split(":")
                filters &= Q(**{f"attributes__{key.strip()}": val.strip()})
        return queryset.filter(filters)
    def filter_tags(self, queryset, name, value):
        tags = value.split(",")
        return queryset.filter(tags__name__in=tags).distinct()
    class Meta:
        model = Product
        fields = ["price_min", "price_max", "condition", "type", "tags"]
