from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import VideoJuego
from .serializers import VideoJuegoSerializer

@api_view(['GET','POST'])
def videojuegos_api(request):
    if request.method == 'GET':
        videojuegos = VideoJuego.objects.filter(activo=True).order_by('nombre')
        plataforma = request.query_params_get('plataforma')

        if plataforma:
            videojuegos =videojuegos.filter(plataforma__iexact=plataforma)

        serializer= VideoJuegoSerializer(videojuegos,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# Create your views here.
