from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view,permission_classes,APIView
from rest_framework.response import Response
from .models import AppointmentType, Appointment,AppointmentResponse
from .serializers import AppointmentTypeSerializer, AppointmentSerializer,AppointmentResponseCreateSerializer,AppointmentResponseSerializer
from django.db.models import Count
from rest_framework import status
from django.conf import settings 
from rest_framework.permissions import IsAuthenticated
from Accounts.models import StudentProfile, SupervisorProfile


@api_view(['GET'])
def list_appointment_types(request):
    types = AppointmentType.objects.all()
    serializer = AppointmentTypeSerializer(types, many=True)
    return Response(serializer.data, status=200)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    user = request.user

    if user.role != 'student':
        return Response(
            {"error": "Only students can create appointments"},
            status=403
        )


    try:
        student_profile = user.profile  
    except StudentProfile.DoesNotExist:
        return Response(
            {"error": "Student profile not found"},
            status=400
        )

    serializer = AppointmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(student=student_profile) 
        return Response(
            {"message": "Appointment created successfully"},
            status=201
        )

    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_appointments(request):
    user = request.user

    if user.role != 'student':
        return Response({"error": "Only students can view their appointments"}, status=403)

    try:
        student_profile = user.profile  # related_name='profile' in StudentProfile
    except StudentProfile.DoesNotExist:
        return Response({"error": "Student profile not found"}, status=400)

    appointments = Appointment.objects.filter(student=student_profile)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data, status=200)


@api_view(['PATCH'])
def update_appointment_status(request, pk):
    try:
        appointment = Appointment.objects.get(id=pk)
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"},
            status=404
        )

    new_status = request.data.get("status")

    if new_status not in ['Pending', 'Accepted', 'Rejected', 'Completed']:
        return Response(
            {"error": "Invalid status"},
            status=400
        )

    appointment.status = new_status
    appointment.save()

    return Response(
        {"message": "Status updated"},
        status=200
    )


@api_view(['GET'])
def appointment_status_count(request):
    data = Appointment.objects.values(
        "status"
    ).annotate(
        total=Count("id")
    )

    return Response(data, status=200)



def post(self, request, appointment_id):
    # Validate supervisor
    try:
        supervisor = request.user.supervisor_profile
    except SupervisorProfile.DoesNotExist:
        return Response(
            {"error": "Only supervisors can respond to appointments."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Validate appointment
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found."}, status=404)

    if appointment.supervisor != supervisor:
        return Response(
            {"error": "You can only respond to appointments assigned to you."},
            status=403
        )

    if hasattr(appointment, "response"):
        return Response(
            {"error": "This appointment already has a response. Use update instead."},
            status=400
        )

    # Create response
    serializer = AppointmentResponseCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    response = serializer.save(
        appointment=appointment,
        student=appointment.student,
        supervisor=supervisor
    )

    # Update appointment status based on supervisor response
    appointment.status = serializer.validated_data["status"] # type: ignore
    appointment.save()

    return Response(
        {
            "message": "Response created successfully.",
            "data": AppointmentResponseSerializer(response).data
        },
        status=201
    )





def patch(self, request, appointment_id):
    try:
        supervisor = request.user.supervisor_profile
    except SupervisorProfile.DoesNotExist:
        return Response(
            {"error": "Only supervisors can edit responses."},
            status=403
        )

    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found."}, status=404)

    if appointment.supervisor != supervisor:
        return Response({"error": "Cannot modify another supervisor's appointment."}, status=403)

    try:
        response = appointment.response # type: ignore
    except AppointmentResponse.DoesNotExist:
        return Response({"error": "No response exists for this appointment."}, status=400)

    # Update response
    serializer = AppointmentResponseCreateSerializer(response, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    # Update appointment status automatically
    if "status" in serializer.validated_data: # type: ignore
        appointment.status = serializer.validated_data["status"] # type: ignore
        appointment.save()

    return Response(
        {"message": "Response updated successfully.", "data": AppointmentResponseSerializer(response).data},
        status=200
    )

