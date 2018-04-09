from django.shortcuts import get_object_or_404

from monitor.models import Repository
from monitor.serializers import RepositorySerializer
from monitor.views.mixins import (
    CommitViewSetMixin, ListCreateRetrieveViewSetMixin, ListRetrieveViewSetMixin
)


class RepositoryCommitsViewSet(CommitViewSetMixin, ListRetrieveViewSetMixin):

    def list(self, request, name, owner):  # pylint: disable=arguments-differ
        repository = get_object_or_404(
            Repository, users=request.user, name=name, owner=owner
        )
        queryset = self.filter_queryset(
            self.get_queryset()
        ).filter(repository=repository)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class RepositoryViewSet(ListCreateRetrieveViewSetMixin):

    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return self.queryset.filter(users=self.request.user)


class CommitViewSet(CommitViewSetMixin, ListRetrieveViewSetMixin):
    pass
