from django.conf import settings
from django.conf.urls import include, url  # noqa
from django.contrib import admin
from django_js_reverse.views import urls_js


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', urls_js, name='js_reverse'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
