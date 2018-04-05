from django.conf.urls import url  # noqa

from users import views  # noqa


urlpatterns = [
    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', views.logout, name='logout'),
]
