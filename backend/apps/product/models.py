from apps.category.models import Category
from django.db import models
from taggit.managers import TaggableManager


class Brand(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    class ConditionChoices(models.TextChoices):
        NW = "New", "New"
        US = "Use", "Use"
        OTHER = "Other", "Other"

    class TypeChoices(models.TextChoices):
        M = "ma", "Man"
        O = "wo", "Woman"

    product_name = models.CharField(max_length=255, unique=True)
    sku = models.CharField(max_length=255)
    brand = models.ForeignKey(
        Brand, on_delete=models.PROTECT, related_name="product_brand"
    )

    description = models.TextField()
    details = models.JSONField(default=list, blank=True)
    tags = TaggableManager()
    attributes = models.JSONField(default=dict, null=True, blank=True)
    type = models.CharField(
        max_length=2,
        choices=TypeChoices.choices,
        default=TypeChoices.M,
    )
    condition = models.CharField(
        max_length=20, choices=ConditionChoices.choices, default=ConditionChoices.NW
    )

    price = models.IntegerField()
    stock = models.IntegerField()
    image_url = models.ImageField(upload_to="product/image")
    hover_image_url = models.ImageField(upload_to="product/image")
    seller_notes = models.TextField()
    material = models.CharField(max_length=500)
    image = models.ImageField(upload_to="product/image", null=True, blank=True)
    is_available = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.product_name


class MultiProductImages(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="multi_images"
    )
    image = models.ImageField(upload_to="product/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
