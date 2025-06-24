from rest_framework import serializers

from .models import Brand, MultiProductImages, Product


class MultiProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultiProductImages
        fields = ["id", "product", "image", "created_at", "updated_at"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "created_at", "updated_at"]


class TagListField(serializers.Field):
    def to_representation(self, value):
        # value is TaggableManager, get all tag names
        if hasattr(value, "all"):
            return [tag.name for tag in value.all()]
        # fallback in case it's already a list
        elif isinstance(value, list):
            return value
        return []

    def to_internal_value(self, data):
        # Accept list or comma-separated string for tags
        if isinstance(data, str):
            # Split comma separated string into list
            data = [tag.strip() for tag in data.split(",") if tag.strip()]
        if not isinstance(data, list):
            raise serializers.ValidationError(
                "Expected a list of tags or a comma-separated string."
            )

        # Clean tags: strip and remove empty strings
        cleaned_tags = []
        for tag_name in data:
            tag_name = tag_name.strip()
            if tag_name:
                cleaned_tags.append(tag_name)

        return cleaned_tags


class ProductSerializer(serializers.ModelSerializer):
    multi_images = MultiProductImagesSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=100000, allow_empty_file=False, use_url=False
        ),
        write_only=True,
    )
    tags = TagListField()
    details = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True,
        required=False,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "sku",
            "description",
            "details",
            "seller_notes",
            "tags",
            "brand",
            "price",
            "stock",
            "is_available",
            "category",
            "material",
            "image_url",
            "hover_image_url",
            "multi_images",
            "uploaded_images",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        uploaded_images = validated_data.pop("uploaded_images")
        product = Product.objects.create(**validated_data)
        product.tags.set(tags)
        for img in uploaded_images:
            MultiProductImages.objects.create(product=product, image=img)
        return product

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        new_images = validated_data.pop("uploaded_images", [])
        instance = super().update(instance, validated_data)
        if tags is not None:
            instance.tags.set(tags)
        existing_ids = [img.id for img in instance.multi_images.all()]
        kept_ids = self.context["request"].data.get("kept_image_ids", [])

        # Add new
        for img in new_images:
            MultiProductImages.objects.create(product=instance, image=img)

        # Remove old
        to_remove = set(existing_ids) - set(kept_ids)
        if to_remove:
            MultiProductImages.objects.filter(
                product=instance, id__in=to_remove
            ).delete()

        return instance
