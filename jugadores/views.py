from django.shortcuts import render
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Jugador
from .serializers import JugadorSerializer

# El listado incorporará paginacion filtro combinado por país y estado
# y busquesa parcial por nickname
# La creacion,actualización y eliminación se reservan para administradores
def respuesta_paginada(queryset,serializer_class, page_number):
    paginator = Paginator(queryset,5)
    page = paginator.get_page(page_number)
    serializer= serializer_class(page.object_list, many=True)
    return Response({
        'pagina_actual': page.number,
        'total_paginas': paginator.num_pages,
        'total_registros': paginator.count,
        'resultados':serializer.data
    })
#-------------------------------------------------------------------------------------------

@api_view(['GET','POST'])
def jugadores_api(request):
    if request.method == 'GET':
        jugadores = Jugador.objects.order_by('nickname')
        pais = request.query_params.get('pais')
        activo= request.query_params.get('activo')
        buscar= request.query_params.get('buscar')

        if pais:
            jugadores = jugadores.filter(pais__iexact=pais)
        if activo is not None:
            if activo.lower() not in ['true','false']:
                return Response({
                    'activo':'Utilice true o false.'},
                     status=status.HTTP_400_BAD_REQUEST)
            jugadores= jugadores.filter(activo=activo.lower()=='true')
        if buscar:
            jugadores= jugadores.filter(nickname_icontains=buscar)