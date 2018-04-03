from rest_framework import routers

from monitor import views


router = routers.SimpleRouter()
router.register(r'repos', views.RepositoryViewSet)
router.register(r'commits', views.CommitViewSet)

urlpatterns = [] + router.urls
