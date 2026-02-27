"""
Custom middleware for FarmCloud
"""
import re
from django.conf import settings
from django.http import HttpResponsePermanentRedirect

class StaticFilesSSLRedirectMiddleware:
    """
    Middleware to exclude static and media files from SECURE_SSL_REDIRECT.
    This prevents unnecessary redirects for asset files.
    """
    
    # Paths that should not be SSL redirected
    EXEMPT_PATHS = [
        r'^/static/',
        r'^/media/',
    ]
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_patterns = [re.compile(pattern) for pattern in self.EXEMPT_PATHS]
    
    def __call__(self, request):
        # Check if path matches exempt patterns
        for pattern in self.exempt_patterns:
            if pattern.match(request.path):
                # For exempt paths, explicitly set this flag to prevent
                # the SecurityMiddleware from forcing SSL redirect
                request.environ['wsgi.url_scheme'] = 'https'
                break
        
        response = self.get_response(request)
        return response
