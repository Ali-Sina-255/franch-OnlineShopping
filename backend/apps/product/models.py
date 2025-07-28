from decimal import Decimal

from apps.carts.models import CartOrder
from apps.category.models import Category
from django.contrib.auth import get_user_model
from django.db import models
from taggit.managers import TaggableManager

User = get_user_model()


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

    product_name = models.CharField(max_length=255)
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
    image_url = models.ImageField(upload_to="product/image", blank=True, null=True)
    hover_image_url = models.ImageField(
        upload_to="product/image", null=True, blank=True
    )
    seller_notes = models.TextField()
    material = models.CharField(max_length=500)
    image = models.ImageField(upload_to="product/image", null=True, blank=True)
    weight = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

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


class DeliveryCouriers(models.Model):
    class DeliveryType(models.TextChoices):
        LOCATION = "location", "Home Location"
        STATION = "station", "Close Station"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart_order = models.ForeignKey(CartOrder, on_delete=models.CASCADE)

    delivery_type = models.CharField(
        max_length=20,
        choices=DeliveryType.choices,
        default=DeliveryType.LOCATION,
    )
    location = models.CharField(max_length=1000)
    delivery_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "carts"
        ordering = ["location"]
        verbose_name_plural = "Delivery Couriers"

    def __str__(self):
        return self.location[:40]

    def calculate_delivery_cost(self):
        total_weight = Decimal("0.00")

        for item in self.cart_order.orderitem.all():
            weight = item.product.weight or Decimal("0.00")
            qty = item.qty or 0
            total_weight += weight * qty

        if self.delivery_type == self.DeliveryType.LOCATION:
            if total_weight <= 500:
                return Decimal("4.50")
            elif total_weight <= 1000:
                return Decimal("5.50")
            elif total_weight <= 2000:
                return Decimal("6.90")
        elif self.delivery_type == self.DeliveryType.STATION:
            if total_weight <= 500:
                return Decimal("7.00")
            elif total_weight <= 1000:
                return Decimal("8.50")
            elif total_weight <= 2000:
                return Decimal("9.90")

        return Decimal("0.00")
