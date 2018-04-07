from django.conf.urls import url

from rest_framework import routers

from monitor import views
from monitor.routers import RepositoryCommitsRouter


repository_commits_router = RepositoryCommitsRouter()
repository_commits_router.register(
    r'commits/(?P<owner>[\w-]+)/(?P<name>[\w-]+)/',
    views.RepositoryCommitsViewSet
)

router = routers.SimpleRouter()
router.register(r'repos', views.RepositoryViewSet)
router.register(r'commits', views.CommitViewSet)

urlpatterns = [
    url(r'^hub/$', views.hub_webhook_view, name='hub')
] + repository_commits_router.urls + router.urls
