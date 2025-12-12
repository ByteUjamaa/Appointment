from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AppointmentType, Teacher, Appointment
from .serializers import AppointmentTypeSerializer, TeacherSerializer, AppointmentSerializer
from django.db.models import Count


@api_view(['GET'])
def list_appointment_types(request):
    types = AppointmentType.objects.all()
    serializer = AppointmentTypeSerializer(types, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def list_teachers(request):
    teachers = Teacher.objects.all()
    serializer = TeacherSerializer(teachers, many=True)

    return Response(serializer.data, status=200)


@api_view(['POST'])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Appointment created successfully"},
            status=201
        )

    return Response(serializer.errors, status=400)


@api_view(['GET'])
def list_appointments(request):
    appointments = Appointment.objects.all()
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
