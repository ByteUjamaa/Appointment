from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import AppointmentReport
from Accounts.models import StudentProfile, SupervisorProfile
from .permissions import IsStudentOrSupervisorReportPermission
from .serializers import (
    AppointmentReportCreateSerializer,
    AppointmentReportSubmitSerializer,
    AppointmentReportReviewSerializer,
    AppointmentReportDetailSerializer,
    AppointmentReportSignatureSerializer
)

# Helper function
def serialize_report(report):
    """Serialize a single report using the detail serializer."""
    return AppointmentReportDetailSerializer(report).data

# List & Create Reports
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def report_list_create(request):
    user = request.user

    # GET: list reports
    if request.method == 'GET':
        try:
            student = StudentProfile.objects.get(user=user)
            reports = AppointmentReport.objects.filter(student=student)
        except StudentProfile.DoesNotExist:
            if hasattr(user, 'supervisorprofile'):
                reports = AppointmentReport.objects.filter(supervisor__user=user)
            else:
                reports = AppointmentReport.objects.none()

        serializer = AppointmentReportDetailSerializer(reports, many=True)
        return Response(serializer.data)

    # POST: create report
    if request.method == 'POST':
        try:
            student = StudentProfile.objects.get(user=user)
        except StudentProfile.DoesNotExist:
            return Response(
                {"detail": "Only students can create reports."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AppointmentReportCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            appointment = serializer.validated_data['appointment']

            if appointment.student.user != user:
                return Response(
                    {"detail": "You can only create reports for your own appointments."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if appointment.status.lower() != 'accepted':
                return Response(
                    {"detail": "You can only write a report after the appointment has been accepted."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()
            return Response(serialize_report(serializer.instance), status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve / Update Report
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated, IsStudentOrSupervisorReportPermission])
def report_detail(request, pk):
    try:
        report = AppointmentReport.objects.get(pk=pk)
    except AppointmentReport.DoesNotExist:
        return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    # Permission check
    permission = IsStudentOrSupervisorReportPermission()
    if not permission.has_object_permission(request, None, report):
        return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        return Response(serialize_report(report))

    # PATCH: edit
    user = request.user
    if hasattr(user, 'studentprofile'):
        if report.status != 'draft':
            return Response({"detail": "Only draft reports can be edited."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AppointmentReportCreateSerializer(report, data=request.data, partial=True, context={'request': request})
    elif hasattr(user, 'supervisorprofile'):
        serializer = AppointmentReportReviewSerializer(report, data=request.data, partial=True)
    else:
        return Response({"detail": "You cannot edit this report."}, status=status.HTTP_403_FORBIDDEN)
    
    if report.status=='signed':
        return Response(
            {'details': 'Signed reports are read-only'},
            status=status.HTTP_403_FORBIDDEN
        )

    if serializer.is_valid():
        serializer.save(reviewed_at=timezone.now() if hasattr(user, 'supervisorprofile') else None)
        return Response(serialize_report(report))

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Submit Report (Student)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def submit_report(request, pk):
    try:
        report = AppointmentReport.objects.get(pk=pk)
    except AppointmentReport.DoesNotExist:
        return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        student = StudentProfile.objects.get(user=request.user)
    except StudentProfile.DoesNotExist:
        return Response({"detail": "Only students can submit reports."}, status=status.HTTP_403_FORBIDDEN)

    if report.student != student:
        return Response({"detail": "You can only submit your own report."}, status=status.HTTP_403_FORBIDDEN)

    serializer = AppointmentReportSubmitSerializer(report, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serialize_report(report), status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Review Report (Supervisor)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def review_report(request, pk):
    try:
        report = AppointmentReport.objects.get(pk=pk)
    except AppointmentReport.DoesNotExist:
        return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        supervisor = SupervisorProfile.objects.get(user=request.user)
    except SupervisorProfile.DoesNotExist:
        return Response({"detail": "Only supervisors can review reports."}, status=status.HTTP_403_FORBIDDEN)

    if report.supervisor != supervisor:
        return Response({"detail": "This report is not assigned to you."}, status=status.HTTP_403_FORBIDDEN)

    serializer = AppointmentReportReviewSerializer(report, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(reviewed_at=timezone.now())
        return Response(serialize_report(report), status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def sign_report(request, pk):
    report=AppointmentReport.objects.get(pk=pk)

    if report.supervisor !=SupervisorProfile:
        return Response({"detail": "Not your report."}, status=403)
    
    serializer = AppointmentReportSignatureSerializer(
        report,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save(
            status='signed',
            signed_at=timezone.now()
        )
        return Response(
            AppointmentReportDetailSerializer(report).data,
            status=200
        )

    return Response(serializer.errors, status=400)
