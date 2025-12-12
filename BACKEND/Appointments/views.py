from rest_framework.decorators import api_view,APIView
from rest_framework.response import Response
from .models import AppointmentType, Teacher, Appointment, AppointmentResponse
from .serializers import AppointmentTypeSerializer, TeacherSerializer, AppointmentSerializer, AppointmentResponseSerializer
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

class AppointmentResponseView(APIView):
   # permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        # Check if logged-in user is a teacher
        try:
            teacher = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "Only teachers can respond to appointments."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if appointment exists
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response(
                {"error": "Appointment not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent teacher from responding to another teacher's appointment
        if appointment.teacher != teacher:
            return Response(
                {"error": "You can only respond to appointments assigned to you."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Prevent multiple responses
        if hasattr(appointment, "response"):
            return Response(
                {"error": "This appointment already has a response. Use update instead."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AppointmentResponseCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save response
        response = serializer.save(
            appointment=appointment,
            student=appointment.student,
            teacher=teacher
        )

        # Sync appointment status
        appointment.status = serializer.validated_data["status"]
        appointment.save()

        return Response(
            {"message": "Response created successfully.", "data": AppointmentResponseSerializer(response).data},
            status=status.HTTP_201_CREATED
        )

    def patch(self, request, appointment_id):
        # Validate teacher
        try:
            teacher = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "Only teachers can edit responses."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Validate appointment
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found."}, status=404)

        # Must belong to the teacher
        if appointment.teacher != teacher:
            return Response(
                {"error": "You cannot modify responses for another teacher's appointment."},
                status=403
            )

        # Response must exist
        try:
            response = appointment.response
        except AppointmentResponse.DoesNotExist:
            return Response(
                {"error": "No response exists for this appointment. Create one first."},
                status=400
            )

        # Update only the fields sent by the teacher
        serializer = AppointmentResponseCreateSerializer(
            response,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update appointment status if included
        if "status" in serializer.validated_data:
            appointment.status = serializer.validated_data["status"]
            appointment.save()

        return Response(
            {"message": "Response updated successfully.", "data": AppointmentResponseSerializer(response).data},
            status=200
        )
