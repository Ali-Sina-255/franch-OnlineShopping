from django.contrib.auth import get_user_model
from django.db import models

from apps.product.models import Product

User = get_user_model()

import uuid


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.cart_id)


class CartItem(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product"
    )
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    quantity = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __unicode__(self) -> str:
        return self.product.product_name
