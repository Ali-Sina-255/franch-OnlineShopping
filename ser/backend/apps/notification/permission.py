# permissions.py
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrOwner(BasePermission):
    """
    Admins can delete any order; non-admins only their own.
    """

    def has_permission(self, request, view):
        # Allow DELETE only for authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Safe methods aren't relevant here since it's DELETE endpoint
        # Allow user if admin
        if request.user.is_staff:
            return True
        # Or if the user owns the object
        return obj.user == request.user
        return obj.user == request.user
