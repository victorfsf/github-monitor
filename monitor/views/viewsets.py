from rest_framework import viewsets

from monitor.models import Commit, Repository
from monitor.serializers import CommitSerializer, RepositorySerializer


class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return self.queryset.filter(users=self.request.user)


class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

    def get_queryset(self):
        return self.queryset.filter(repository__users=self.request.user)
