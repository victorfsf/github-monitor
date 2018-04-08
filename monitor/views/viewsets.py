from django.shortcuts import get_object_or_404

from rest_framework import viewsets

from monitor.models import Commit, Repository
from monitor.serializers import CommitSerializer, RepositorySerializer


class CommitViewSetMixin(object):

    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

    def get_queryset(self):
        return self.queryset.filter(repository__users=self.request.user)


class RepositoryCommitsViewSet(CommitViewSetMixin, viewsets.GenericViewSet):

    def list(self, request, name, owner):
        repository = get_object_or_404(
            Repository, users=request.user, name=name, owner=owner
        )
        queryset = self.filter_queryset(
            self.get_queryset()
        ).filter(repository=repository)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class RepositoryViewSet(viewsets.ModelViewSet):

    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return self.queryset.filter(users=self.request.user)


class CommitViewSet(CommitViewSetMixin, viewsets.ModelViewSet):
    pass
