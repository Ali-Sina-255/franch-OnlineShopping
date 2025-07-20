from apps.product.models import Product
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from shortuuid.django_fields import ShortUUIDField

User = get_user_model()
import uuid



class Cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="carts")
    qty = models.PositiveIntegerField(default=1, null=True, blank=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    cart_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cart_id} - {self.product.product_name}"

    def save(self, *args, **kwargs):

        if self.product and self.qty:
            self.total = self.product.price * self.qty
        super().save(*args, **kwargs)


# -------------------------------
# 📦 Cart Order Model
# -------------------------------
class CartOrder(models.Model):
    PAYMENT_STATUS = (
        ("paid", "Paid"),
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("cancelled", "Cancelled"),
        ("initiated", "Initiated"),
        ("failed", "Failed"),
        ("refunding", "Refunding"),
        ("refunded", "Refunded"),
        ("unpaid", "Unpaid"),
        ("expired", "Expired"),
    )

    ORDER_STATUS = (
        ("Pending", "Pending"),
        ("Fulfilled", "Fulfilled"),
        ("Partially Fulfilled", "Partially Fulfilled"),
        ("Cancelled", "Cancelled"),
    )

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_status = models.CharField(
        max_length=100, choices=PAYMENT_STATUS, default="initiated"
    )
    order_status = models.CharField(
        max_length=100, choices=ORDER_STATUS, default="Pending"
    )

    # Customer details
    full_name = models.CharField(max_length=1000)
    email = models.EmailField(max_length=1000)
    mobile = models.CharField(max_length=1000)

    # Shipping info
    address = models.CharField(max_length=1000, null=True, blank=True)
    city = models.CharField(max_length=1000, null=True, blank=True)
    state = models.CharField(max_length=1000, null=True, blank=True)
    country = models.CharField(max_length=1000, null=True, blank=True)

    oid = ShortUUIDField(length=30, max_length=40, alphabet="abcdefghijklmnopqrstuvxyz")
    date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "Cart Orders"

    def __str__(self):
        return self.oid

    def get_order_items(self):
        return self.orderitem.all()

    def calculate_total(self):
        return sum(item.total for item in self.get_order_items())

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.total = self.calculate_total()
        super().save(update_fields=["total"])


# -------------------------------
# 🧾 Cart Order Item Model
# -------------------------------
class CartOrderItem(models.Model):
    order = models.ForeignKey(
        CartOrder, on_delete=models.CASCADE, related_name="orderitem"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="order_items"
    )
    qty = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    sub_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    oid = ShortUUIDField(length=30, max_length=40, alphabet="abcdefghijklmnopqrstuvxyz")
    date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "Cart Order Items"

    def __str__(self):
        return self.oid

    def order_id(self):
        return f"Order ID #{self.order.oid}"

    @property
    def total_price(self):
        return self.total

    def save(self, *args, **kwargs):
        self.sub_total = self.qty * self.price
        self.total = self.sub_total
        super().save(*args, **kwargs)

        # Update order total after saving item
        self.order.total = self.order.calculate_total()
        self.order.save(update_fields=["total"])


class Wishlist(models.Model):
    # A foreign key relationship to the User model with CASCADE deletion
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    # A foreign key relationship to the Product model with CASCADE deletion, specifying a related name
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="wishlist"
    )
    # Date and time field
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Wishlist"

    # Method to return a string representation of the object
    def __str__(self):
        if self.product.title:
            return self.product.title
        else:
            return "Wishlist"
