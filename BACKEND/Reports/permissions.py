from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsStudentOrSupervisorReportPermission(BasePermission):
    """
    Custom permission:
    - Students can edit their own reports (draft only)
    - Supervisors can review reports assigned to them (submitted only)
    """

    def has_permission(self, request, view):

        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
       
        if request.method in SAFE_METHODS:
            return (
                obj.student.user == request.user or
                obj.supervisor.user == request.user
            )


        if obj.student.user == request.user:
            if request.method in ['PUT', 'PATCH']:
                return obj.status == 'draft'
            return False

        if obj.supervisor.user == request.user:
            if request.method in ['PUT', 'PATCH']:
                return obj.status == 'submitted'
            return False

        return False
