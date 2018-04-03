from django.conf.urls import url  # noqa
from django.contrib.auth import views as auth_views

from users import views  # noqa


urlpatterns = [
    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
]
