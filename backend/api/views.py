from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows items to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint."""
    return Response({'status': 'healthy', 'message': 'API is running'})
