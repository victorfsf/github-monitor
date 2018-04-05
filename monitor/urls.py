from django.conf.urls import url

from rest_framework import routers

from monitor import views


router = routers.SimpleRouter()
router.register(r'repos', views.RepositoryViewSet)
router.register(r'commits', views.CommitViewSet)

urlpatterns = [
    url(r'^hub/$', views.hub_webhook_view, name='hub')
] + router.urls
