import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.users.models import User
from apps.users.views import CustomUserDetailsView


@pytest.mark.django_db
def test_authentication_requirement(normal_user):
    client = APIClient()
    url = reverse("user-details")
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    client.force_authenticate(user=normal_user)
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_retrieve_user_details(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("user-details")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["email"] == normal_user.email
    assert response.data["first_name"] == normal_user.first_name
    assert response.data["last_name"] == normal_user.last_name


@pytest.mark.django_db
def test_update_details(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("user-details")

    new_first_name = "updatedFirstName"
    new_last_name = "newLastName"
    update_data = {"first_name": new_first_name, "last_name": new_last_name}
    response = client.patch(url, update_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["first_name"] == new_first_name
    assert response.data["last_name"] == new_last_name


@pytest.mark.django_db
def test_get_queryset_emp(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("user-details")

    response = client.get(url)
    view = CustomUserDetailsView()
    view.request = response.wsgi_request
    queryset = view.get_queryset()
    assert queryset.count() == 0
