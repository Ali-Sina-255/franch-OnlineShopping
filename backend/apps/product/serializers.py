from rest_framework import serializers
from .models import Product, MultiProductImages

class MultiProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultiProductImages
        fields = ['id', 'product', 'image', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    images = MultiProductImagesSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'product_name', 'slug', 'description', 'price',
            'images', 'stock', 'is_available', 'category',
            'created_at', 'updated_at', 'uploaded_images'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images')
        product = Product.objects.create(**validated_data)
        for image in uploaded_images:
            MultiProductImages.objects.create(product=product, image=image)
        return product
