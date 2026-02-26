from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Settings
from .serializers import SettingsSerializer

class SettingsViewSet(viewsets.ViewSet):
    """
    ViewSet for application settings (singleton)
    """
    
    def list(self, request):
        """Get the settings instance"""
        settings = Settings.load()
        serializer = SettingsSerializer(settings)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get the settings instance"""
        settings = Settings.load()
        serializer = SettingsSerializer(settings)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Update settings"""
        settings = Settings.load()
        serializer = SettingsSerializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """Partially update settings"""
        return self.update(request, pk)
