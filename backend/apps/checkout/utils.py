import datetime


def generate_order(pk):
    current_datetime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    order_number = current_datetime + str(pk)
    return order_number


url = "https://www.paypal.com/sdk/js?client-id={{PAYPAL_CLIENT_ID}}&currency=USD"
