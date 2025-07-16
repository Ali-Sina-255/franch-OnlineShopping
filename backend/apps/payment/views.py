import logging
from decimal import Decimal

import requests
from apps.cart.models import Cart
from apps.orders.models import Payment
from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

logger = logging.getLogger(__name__)


def get_access_token(client_id, secret_id):
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {"grant_type": "client_credentials"}
    auth = (client_id, secret_id)

    response = requests.post(token_url, data=data, auth=auth)
    if response.status_code == 200:
        logger.info("Access Token retrieved successfully")
        return response.json()["access_token"]
    else:
        logger.error(
            f"Failed to get access token: {response.status_code} {response.text}"
        )
        raise Exception("PayPal authentication failed.")


class PaymentSuccessView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data
        logger.info(f"PaymentSuccessView called with payload: {payload}")

        order_id = payload.get("order_id")
        paypal_order_id = payload.get("paypal_order_id")

        if not all([order_id, paypal_order_id]):
            logger.error("Missing required fields: order_id or paypal_order_id")
            return Response(
                {"error": "Missing required fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch Cart and Order
        try:
            cart = Cart.objects.get(cart_id=order_id)
            order = cart.order  # Assuming `cart.order` FK exists
            logger.info(f"Cart ID {cart.cart_id} and Order ID {order.id} found.")
        except Cart.DoesNotExist:
            logger.error(f"Cart not found with cart_id: {order_id}")
            return Response(
                {"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except AttributeError:
            logger.error(f"Order not found for Cart ID: {cart.cart_id}")
            return Response(
                {"error": "Order not found for cart."}, status=status.HTTP_404_NOT_FOUND
            )

        # Ignore fake/null PayPal ID
        if paypal_order_id == "null":
            logger.error("Invalid PayPal order ID received.")
            return Response(
                {"error": "Invalid PayPal order ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify PayPal payment
        try:
            access_token = get_access_token(settings.CLIENT_ID, settings.SECRET_KEY)
        except Exception as e:
            logger.error(f"PayPal token fetch failed: {e}")
            return Response(
                {"error": "Failed to authenticate with PayPal."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        paypal_url = (
            f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}"
        )
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        }
        response = requests.get(paypal_url, headers=headers)
        logger.info(f"PayPal response: {response.status_code} | {response.text}")

        if response.status_code != 200:
            logger.error(f"PayPal order verification failed: {response.text}")
            return Response(
                {"error": "Failed to verify PayPal order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        paypal_data = response.json()
        paypal_status = paypal_data.get("status")

        if paypal_status == "COMPLETED":
            if order.status != "Completed":
                try:
                    payment = Payment.objects.create(
                        user=cart.user,
                        payment_id=paypal_order_id,
                        payment_method="PayPal",
                        amount=Decimal(order.order_total),
                        status="Completed",
                    )
                except Exception as e:
                    logger.error(f"Payment record creation failed: {e}")
                    return Response(
                        {"error": "Failed to record payment."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                order.payment = payment
                order.status = "Completed"
                order.is_ordered = True
                order.save()

                logger.info(
                    f"Order {order.id} marked as completed. Payment ID: {payment.id}"
                )
                return Response(
                    {"message": "Payment processed and order completed."},
                    status=status.HTTP_200_OK,
                )
            else:
                logger.info(f"Order {order.id} already completed.")
                return Response(
                    {"message": "Payment already completed."}, status=status.HTTP_200_OK
                )
        else:
            logger.warning(f"PayPal status not COMPLETED: {paypal_status}")
            return Response(
                {"message": "Payment not completed yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )
