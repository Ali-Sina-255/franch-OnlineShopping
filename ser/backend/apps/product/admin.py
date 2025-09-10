from django.contrib import admin

from .models import DeliveryCouriers, MultiProductImages, Product

admin.site.register(Product)
admin.site.register(MultiProductImages)
admin.site.register(DeliveryCouriers)
