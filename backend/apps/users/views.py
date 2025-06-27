from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CustomRegisterSerializer, UserSerializer

User = get_user_model()


class CustomUserDetailsView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomRegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        return get_user_model().objects.none()


class UserRegisterAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomRegisterSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(request=self.request)
