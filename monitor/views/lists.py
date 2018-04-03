from rest_framework.generics import ListAPIView, RetrieveAPIView

from monitor.models import Commit, Repository
from monitor.serializers import CommitSerializer, RepositorySerializer


class CommitList(ListAPIView):
    serializer_class = CommitSerializer

    def get_queryset(self):
        return Commit.objects.filter(
            repository_id=self.kwargs.get('repository_id'),
            repository__users=self.request.user
        )


class RepositoryList(RetrieveAPIView):
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return Repository.objects.filter(users=self.request.user, id=self.kwargs.get('pk'))
