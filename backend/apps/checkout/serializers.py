from rest_framework import serializers


class CheckoutInitSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()
    email = serializers.EmailField()
    address = serializers.CharField()
    state = serializers.CharField()
    city = serializers.CharField()
