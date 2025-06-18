import os
from datetime import date, timedelta
from os import getenv, path
from pathlib import Path

from dotenv import load_dotenv
from loguru import logger

ROOT_DIR = Path(__file__).resolve().parent.parent.parent

BASE_DIR = ROOT_DIR / "apps"

ALLOWED_HOSTS = ["0.0.0.0", "localhost", "127.0.0.1", "api"]

local_env_file = path.join(ROOT_DIR, ".env", ".env")
if path.isfile(local_env_file):
    load_dotenv(local_env_file)
else:
    logger.warning(f".env.local file not found at {local_env_file}")
SECRET_KEY = getenv("DJANGO_SECRET_KEY")

# DEBUG mode

# Application definition
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
]


LOCAL_APPS = [
    "apps.users",
    "apps.common",
]

THIRD_PARTY_APPS = [
    "drf_yasg",
    "rest_framework",
    "django_filters",
    "corsheaders",
    "rest_framework.authtoken",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
]


INSTALLED_APPS = DJANGO_APPS + LOCAL_APPS + THIRD_PARTY_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database settings
# Update these according to your setup, for now this is a placeholder
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ROOT_DIR
        / "db.sqlite3",  # Creates the SQLite database in the base directory
    }
}

# Password validation settings
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Localization settings
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"

STATIC_ROOT = str(ROOT_DIR / "staticfiles")

# Media files (uploads)
MEDIA_URL = "/media/"

MEDIA_ROOT = str(ROOT_DIR / "mediafile")

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS settings (Optional)
CORS_URLS_REGEX = r"^api/.*$"

AUTH_USER_MODEL = "users.User"

ADMIN_URL = "supersecret/"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# for allauth account
SITE_ID = 1

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER)

# rest framework  settings

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKEND": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}

REST_AUTH = {
    # Authentication settings
    "USE_JWT": True,  # Set to True if using JWT-based authentication (with dj-rest-auth.jwt_auth)
    "JWT_AUTH_COOKIE": "author-access-token",
    "JWT_AUTH_REFRESH_COOKIE": "author-refresh-token",
}

AUTHENTICATION_BACKENDS = (
    "allauth.account.auth_backends.AuthenticationBackend",
    "django.contrib.auth.backends.ModelBackend",  # Corrected typo: 'backend' instead of 'backend'
)

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),  # Corrected to be a tuple
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),  # Lifetime for access tokens
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),  # Corrected key name
    "ROTATE_REFRESH_TOKENS": True,  # Fixed typo in key
    "SIGNING_KEY": getenv("SIGNING_KEY"),  # Ensure this is set in your environment
    "USER_ID_FIELD": "id",  # Field that stores user ID
    "USER_ID_CLAIM": "user_id",  # Claim that holds user ID
}
