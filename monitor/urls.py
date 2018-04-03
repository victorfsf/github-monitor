from django.conf.urls import url

from monitor import views


urlpatterns = [
    url(r'^commits/(?P<repository_id>[\d]+)/',
        views.CommitList.as_view(), name='commit-list'),
    url(r'^repositories/(?P<pk>[\d]+)/',
        views.RepositoryList.as_view(), name='repository-list')
]
