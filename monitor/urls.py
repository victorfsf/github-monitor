from django.conf.urls import url

from rest_framework import routers

from monitor import views
from monitor.routers import RepositoryNameRouter


repository_name_router = RepositoryNameRouter()
repository_name_router.register(
    r'repos/(?P<owner>[\w-]+)/(?P<name>[\w-]+)/',
    views.RepositoryNameViewSet
)

router = routers.SimpleRouter()
router.register(r'repos', views.RepositoryViewSet)
router.register(r'commits', views.CommitViewSet)

urlpatterns = [
    url(r'^hub/$', views.hub_webhook_view, name='hub')
] + repository_name_router.urls + router.urls
