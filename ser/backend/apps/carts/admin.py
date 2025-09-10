from django.contrib import admin

from .models import Cart, CartOrder, CartOrderItem

admin.site.register(Cart)
admin.site.register(CartOrder)
admin.site.register(CartOrderItem)
