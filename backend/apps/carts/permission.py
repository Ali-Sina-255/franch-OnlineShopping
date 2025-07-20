from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrOwner(BasePermission):
    """
    Allow delete if user is admin, else if they own the object.
    """

    def has_object_permission(self, request, view, obj):
        # Allow admins
        if request.user and request.user.is_staff:
            return True
        # Allow the owner to delete their own order
        return obj.user == request.user
