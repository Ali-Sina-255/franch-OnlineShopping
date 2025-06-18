from django.urls import path

from .views import (
    AttributeTypeDetailView,
    AttributeTypeListView,
    AttributeValueDetailView,
    AttributeValueListView,
    CategoryDetailView,
    CategoryListView,
)

urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path("<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path(
        "attribute-types/", AttributeTypeListView.as_view(), name="attribute-type-list"
    ),
    path(
        "attribute-types/<int:pk>/",
        AttributeTypeDetailView.as_view(),
        name="attribute-type-detail",
    ),
    path(
        "attribute-values/",
        AttributeValueListView.as_view(),
        name="attribute-value-list",
    ),
    path(
        "attribute-values/<int:pk>/",
        AttributeValueDetailView.as_view(),
        name="attribute-value-detail",
    ),
]
