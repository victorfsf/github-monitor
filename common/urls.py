from django.conf.urls import url

from common import views


urlpatterns = [
    url(r'^', views.app_view, name='index')
]
