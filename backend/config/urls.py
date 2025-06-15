from dj_rest_auth.views import PasswordResetConfirmView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from apps.users.views import CustomUserDetailsView

# OpenAPI schema view (Swagger/Redoc)
schema_view = get_schema_view(
    openapi.Info(
        title="Author Haven API Documentation",
        default_version="v1",
        description=(
            "Author Haven API documentation.\n\n"
            "Contacts:\n"
            "- Ali Sina Sultani: alisinasultani@gmail.com\n"
        ),
        contact=openapi.Contact(email="alisinasultani@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # Auth endpoints
    path("api/v1/auth/user/", CustomUserDetailsView.as_view(), name="user-details"),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path("api/v1/auth/registration/", include("dj_rest_auth.registration.urls")),
    # Password reset confirm (fix URL name and typo)
    path(
        "api/v1/auth/password/reset/confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Optional: Customize admin UI
admin.site.site_header = "Online Shopping Center  Admin"
admin.site.site_title = "Online Shopping Center  Admin Portal"
admin.site.index_title = "Welcome to Online Shopping Center  API Portal"
