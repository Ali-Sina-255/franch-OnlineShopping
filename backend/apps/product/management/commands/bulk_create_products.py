import random

from django.core.management.base import BaseCommand

from apps.product.models import Brand, Category, Product


class Command(BaseCommand):
    help = "Bulk create 500 Product records"

    def handle(self, *args, **kwargs):
        brands = list(Brand.objects.all())
        categories = list(Category.objects.all())

        if not brands:
            brands = [Brand.objects.create(name=f"Brand {i}") for i in range(5)]

        if not categories:
            categories = [
                Category.objects.create(name=f"Category {i}") for i in range(5)
            ]

        products = []

        for i in range(500):
            brand = random.choice(brands)
            category = random.choice(categories)

            product_name = f"Product {i+1} - {brand.name}"

            product = Product(
                product_name=product_name,
                brand=brand,
                description=f"This is description for {product_name}",
                details=["detail1", "detail2"],
                attributes={"color": "red", "size": "M"},
                type=random.choice(
                    [choice[0] for choice in Product.TypeChoices.choices]
                ),
                condition=random.choice(
                    [choice[0] for choice in Product.ConditionChoices.choices]
                ),
                price=random.randint(10, 1000),
                stock=random.randint(0, 100),
                image_url=None,
                hover_image_url=None,
                seller_notes="Some notes about the product",
                material="Cotton",
                image=None,
                is_available=True,
                category=category,
            )
            products.append(product)

        # Create the products in bulk (M2M not yet saved)
        Product.objects.bulk_create(products)
        self.stdout.write(self.style.SUCCESS("Successfully created 500 products!"))

        # Fetch the most recently created 500 products
        new_products = Product.objects.order_by("-id")[:500]

        # Assign tags — you can randomize this if needed
        for product in new_products:
            product.tags.add("summer", "cotton", "sale")
