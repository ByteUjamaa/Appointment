from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import AppointmentReport
from .serializers import AppointmentReportSerializer
from .permissions import IsStudentOrSupervisorReportPermission
from Accounts.models import StudentProfile,SupervisorProfile
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from Accounts.models import StudentProfile
from .models import AppointmentReport
from .serializers import AppointmentReportSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def report_list_create(request):
    user = request.user

    if request.method == 'GET':
        try:
            student = StudentProfile.objects.get(user=user)
            reports = AppointmentReport.objects.filter(student=student)
        except StudentProfile.DoesNotExist:
            if hasattr(user, 'supervisorprofile'):
                reports = AppointmentReport.objects.filter(supervisor__user=user)
            else:
                reports = AppointmentReport.objects.none()

        serializer = AppointmentReportSerializer(reports, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        try:
            student = StudentProfile.objects.get(user=user)
        except StudentProfile.DoesNotExist:
            return Response(
                {"detail": "Only students can create reports."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AppointmentReportSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.validated_data['appointment']

            if appointment.student.user != user:
                return Response(
                    {"detail": "You can only create a report for your own appointment."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if appointment.status.lower() != 'accepted':
                return Response(
                    {
                        "detail": "You can only write a report after the appointment has been accepted."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save(
                student=student,
                supervisor=appointment.supervisor
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsStudentOrSupervisorReportPermission])
def report_detail(request, pk):

    try:
        report = AppointmentReport.objects.get(pk=pk)
    except AppointmentReport.DoesNotExist:
        return Response(
            {"detail": "Report not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    permission = IsStudentOrSupervisorReportPermission()
    if not permission.has_object_permission(request, None, report):
        return Response(
            {"detail": "Permission denied."},
            status=status.HTTP_403_FORBIDDEN
        )


    if request.method == 'GET':
        serializer = AppointmentReportSerializer(report)
        return Response(serializer.data)


    serializer = AppointmentReportSerializer(
        report,
        data=request.data,
        partial=(request.method == 'PATCH')
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def submit_report(request, pk):
    try:
        report = AppointmentReport.objects.get(pk=pk)
    except AppointmentReport.DoesNotExist:
        return Response(
            {"detail": "Report not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        student = StudentProfile.objects.get(user=request.user)
    except StudentProfile.DoesNotExist:
        return Response(
            {"detail": "Only students can submit reports."},
            status=status.HTTP_403_FORBIDDEN
        )

    if report.student != student:
        return Response(
            {"detail": "You can only submit your own report."},
            status=status.HTTP_403_FORBIDDEN
        )

    if report.status != 'draft':
        return Response(
            {"detail": "Only draft reports can be submitted."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if report.appointment.status.lower() != 'accepted':
        return Response(
            {"detail": "Appointment must be accepted before submitting report."},
            status=status.HTTP_400_BAD_REQUEST
        )

    report.status = 'submitted'
    report.save()

    serializer = AppointmentReportSerializer(report)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def review_report(request, pk):
    try:
        report = AppointmentReport.objects.get(pk=pk)
    except AppointmentReport.DoesNotExist:
        return Response(
            {"detail": "Report not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        supervisor = SupervisorProfile.objects.get(user=request.user)
    except SupervisorProfile.DoesNotExist:
        return Response(
            {"detail": "Only supervisors can review reports."},
            status=status.HTTP_403_FORBIDDEN
        )

    if report.supervisor != supervisor:
        return Response(
            {"detail": "This report is not assigned to you."},
            status=status.HTTP_403_FORBIDDEN
        )

    if report.status != 'submitted':
        return Response(
            {"detail": "Only submitted reports can be reviewed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    new_status = request.data.get('status')
    comment = request.data.get('supervisor_comment', '')

    if new_status not in ['approved', 'rejected']:
        return Response(
            {"detail": "Status must be approved or rejected."},
            status=status.HTTP_400_BAD_REQUEST
        )

    report.status = new_status
    report.supervisor_comment = comment
    report.reviewed_at = timezone.now()
    report.save()

    serializer = AppointmentReportSerializer(report)
    return Response(serializer.data, status=status.HTTP_200_OK)
