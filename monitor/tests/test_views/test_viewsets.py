from unittest.mock import MagicMock

from django.test import TestCase

from model_mommy import mommy

from monitor.models import Commit, Repository
from monitor.views import CommitViewSet, RepositoryViewSet


class TestViewSetMixin(object):
    model = None
    view_set = None
    user_kwarg = None

    def setUp(self):
        self.user = mommy.make('users.User')
        self.empty_user = mommy.make('users.User')
        self.view = self.view_set()  # pylint: disable=not-callable
        self.repositories = mommy.make(
            self.model, _quantity=10,
            **{self.user_kwarg: [self.user]}
        )

    def test_get_queryset(self):
        self.view.request = MagicMock()
        self.view.request.user = self.user
        self.assertEqual(
            list(self.view.get_queryset()),
            list(self.model.objects.filter(**{self.user_kwarg: self.user}))
        )

    def test_get_queryset_is_empty(self):
        self.view.request = MagicMock()
        self.view.request.user = self.empty_user
        self.assertFalse(self.view.get_queryset().exists())

    def tearDown(self):
        self.user.delete()
        self.empty_user.delete()
        for repo in self.repositories:
            repo.delete()


class TestRepositoryViewSet(TestViewSetMixin, TestCase):
    model = Repository
    view_set = RepositoryViewSet
    user_kwarg = 'users'


class TestCommitViewSet(TestViewSetMixin, TestCase):
    model = Commit
    view_set = CommitViewSet
    user_kwarg = 'repository__users'
