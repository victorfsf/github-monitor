from django.conf import settings
from django.conf.urls import include, url
from django_js_reverse.views import urls_js
from common.site import admin

urlpatterns = [
    url(r'^admin/', admin.urls),
    url(r'^jsreverse/$', urls_js, name='js_reverse'),
    url(r'^auth/', include('users.urls', namespace='users')),
    url(r'^oauth/', include('social_django.urls', namespace='oauth')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
