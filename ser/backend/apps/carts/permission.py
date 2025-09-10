from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrOwner(BasePermission):
    """
    Custom permission: 
    - Allow access if user is admin (is_staff).
    - Allow access if user is the owner of the object.
    """

    def has_permission(self, request, view):
        # Global permission check: user must be authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admins can access any object
        if request.user.is_staff:
            return True
        # Object-level permission: only allow access if the user owns the object
        return obj.user == request.user


class IsNotAdminUser(BasePermission):
    """
    Allows access only to non-admin (regular) users.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_staff and not request.user.is_superuser
