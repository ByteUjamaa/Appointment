from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AppointmentType
from .serializers import AppointmentTypeSerializer

@api_view(['GET'])
def list_appointment_types(request):
    types = AppointmentType.objects.all()
    serializer = AppointmentTypeSerializer(types, many=True)
    return Response(serializer.data, status=200)
