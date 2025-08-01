from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
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
