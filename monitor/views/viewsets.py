from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response

from monitor.models import Commit, Repository
from monitor.serializers import CommitSerializer, RepositorySerializer


class RepositoryViewSetMixin(object):

    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return self.queryset.filter(users=self.request.user)


class RepositoryNameViewSet(RepositoryViewSetMixin, viewsets.ViewSet):

    def retrieve(self, request, name, owner):  # pylint: disable=unused-argument
        queryset = self.get_queryset()
        repository = get_object_or_404(queryset, name=name, owner=owner)
        serializer = RepositorySerializer(repository)
        return Response(serializer.data)


class RepositoryViewSet(RepositoryViewSetMixin, viewsets.ModelViewSet):
    pass


class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

    def get_queryset(self):
        return self.queryset.filter(repository__users=self.request.user)
