"""
FarmCloud URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from decouple import config

# Admin URL - Change ADMIN_URL_PATH in production .env for security
ADMIN_URL_PATH = config('ADMIN_URL_PATH', default='admin')

urlpatterns = [
    path('', RedirectView.as_view(url=f'/{ADMIN_URL_PATH}/', permanent=False)),
    path(f'{ADMIN_URL_PATH}/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('inventory.urls')),
    path('api/', include('customers.urls')),
    path('api/', include('settings.urls')),
]

# Configure admin site
admin.site.site_header = "FarmCloud Admin Portal"
admin.site.site_title = "FarmCloud Admin"
admin.site.index_title = "Welcome to FarmCloud Management"

# Debug toolbar
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
