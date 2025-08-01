from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class CustomLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "limit"
    offset_query_param = "offset"
    max_limit = 100


class ProductPageNumberPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100
