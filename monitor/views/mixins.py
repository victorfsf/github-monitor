from rest_framework import mixins, viewsets

from monitor.models import Commit
from monitor.serializers import CommitSerializer


class CommitViewSetMixin(object):

    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

    def get_queryset(self):
        return self.queryset.filter(repository__users=self.request.user)


class ListRetrieveViewSetMixin(
        mixins.RetrieveModelMixin, mixins.ListModelMixin,
        viewsets.GenericViewSet):
    pass


class ListCreateRetrieveViewSetMixin(
        mixins.CreateModelMixin, ListRetrieveViewSetMixin):
    pass
