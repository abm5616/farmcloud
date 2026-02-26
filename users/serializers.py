from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    last_login_display = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'status', 'phone_number', 'avatar', 'date_joined',
            'last_login', 'last_login_display', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'avatar']
    
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    
    def get_last_login_display(self, obj):
        if obj.last_login:
            from django.utils import timezone
            from datetime import timedelta
            
            now = timezone.now()
            diff = now - obj.last_login
            
            if diff < timedelta(hours=1):
                minutes = diff.seconds // 60
                return f"{minutes} min ago" if minutes > 0 else "Just now"
            elif diff < timedelta(days=1):
                hours = diff.seconds // 3600
                return f"{hours} hour{'s' if hours != 1 else ''} ago"
            elif diff < timedelta(days=7):
                days = diff.days
                return f"{days} day{'s' if days != 1 else ''} ago"
            else:
                return obj.last_login.strftime('%b %d, %Y')
        return "Never"


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'role', 'status', 'phone_number'
        ]
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'STAFF'),
            status=validated_data.get('status', 'ACTIVE'),
            phone_number=validated_data.get('phone_number', '')
        )
        return user
