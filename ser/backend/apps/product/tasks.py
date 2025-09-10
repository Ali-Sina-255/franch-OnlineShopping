from celery import shared_task


@shared_task
def process_new_product(product_id):
    from apps.product.models import Product

    product = Product.objects.get(id=product_id)

    print(f"New product created: {product.product_name}")
