from apps.carts.models import CartOrder, CartOrderItem
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

User = get_user_model()


# Create your models here.
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(
        CartOrder, on_delete=models.SET_NULL, null=True, blank=True
    )
    # A foreign key relationship to the CartOrderItem model with CASCADE deletion, specifying a related name
    order_item = models.ForeignKey(
        CartOrderItem, on_delete=models.SET_NULL, null=True, blank=True
    )
    # Is read Boolean Field
    seen = models.BooleanField(default=False)
    # Date and time field
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = "Notification"

    # Method to return a string representation of the object
    def __str__(self):
        if self.order:
            return self.order.oid
        else:
            return "Notification"



class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=400, unique=True)
    message = models.TextField()

    def __repr__(self):
        return f"{self.email } contacted {self.message}"
