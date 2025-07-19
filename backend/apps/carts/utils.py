import logging
from datetime import datetime

from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection, send_mail
from django.core.mail.backends.smtp import EmailBackend
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

from apps.carts.models import CartOrderItem


def send_payment_success_email(order):
    subject = "✅ Payment Confirmation - Your Shop"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [order.email]

    # Get all items in the order
    order_items = CartOrderItem.objects.filter(order=order)

    context = {
        "full_name": order.full_name,
        "order_id": order.oid,
        "order_items": [
            {
                "product_name": item.product.product_name,
                "price": f"{item.price:.2f}",
                "total_price": f"{item.total:.2f}",
            }
            for item in order_items
        ],
        "order_total": f"{order.total:.2f}",
        "support_email": settings.DEFAULT_FROM_EMAIL,
        "year": datetime.now().year,
    }

    html_content = render_to_string("emails/payment_success_email.html", context)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(subject, text_content, from_email, to)
    email.attach_alternative(html_content, "text/html")
    email.send()
