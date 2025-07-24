from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="E-commerce Backend APIs",
        default_version="v1",
        description="This is the API documentation for e-commerce project APIs",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="desphixs@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path(
        "swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"
    ),
    path("", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.users.urls"), name="category"),
    path("api/v1/category/", include("apps.category.urls"), name="category"),
    path("api/v1/product/", include("apps.product.urls"), name="product"),
    path("api/v1/profiles/", include("apps.profiles.urls"), name="profiles"),
    path("api/v1/cart/", include("apps.carts.urls"), name="carts"),
    path(
        "api/v1/notification/", include("apps.notification.urls"), name="notification"
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "Online Shopping Center Admin"
admin.site.site_title = "Online Shopping Center Admin Portal"
admin.site.index_title = "Welcome to Online Shopping Center API Portal"

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
