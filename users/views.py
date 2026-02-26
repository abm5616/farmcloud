from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer, UserCreateSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]  # TODO: Change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        """Toggle user status between ACTIVE and INACTIVE"""
        user = self.get_object()
        user.status = 'INACTIVE' if user.status == 'ACTIVE' else 'ACTIVE'
        user.is_active = (user.status == 'ACTIVE')
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """Get users filtered by role"""
        role = request.query_params.get('role', None)
        if role:
            users = self.queryset.filter(role=role.upper())
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)
        return Response({'error': 'Role parameter required'}, status=status.HTTP_400_BAD_REQUEST)
