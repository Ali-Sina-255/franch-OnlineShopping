from django.db import models
from apps.category.models import Category

class Product(models.Model):
    product_name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    price = models.IntegerField()
    images = models.ImageField(upload_to='photos/products/')
    stock = models.IntegerField()
    is_available = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

class MultiProductImages(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE, related_name='multi_images')
    image = models.ImageField(upload_to='product/',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)