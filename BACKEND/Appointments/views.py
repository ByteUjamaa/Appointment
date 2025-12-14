from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .models import AppointmentType, Appointment
from .serializers import AppointmentTypeSerializer, AppointmentSerializer
from django.db.models import Count
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
