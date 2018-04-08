from unittest.mock import MagicMock

from django.http import Http404
from django.test import TestCase

from model_mommy import mommy

from monitor.models import Commit, Repository
from monitor.views import CommitViewSet, RepositoryCommitsViewSet, RepositoryViewSet


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


class TestRepositoryCommitsViewSet(TestCase):

    def setUp(self):
        self.view = RepositoryCommitsViewSet()
        self.user = mommy.make('users.User')
        self.view.request = MagicMock(user=self.user)
        self.view.request.build_absolute_uri.return_value = 'http://fake-url'
        self.view.format_kwarg = None
        self.repo = mommy.make(
            'monitor.Repository',
            name='repo-name', owner='repo-owner',
            users=[self.user], commits=[]
        )

    def assertIDsMatch(self, result, expected, x, y):
        self.assertEqual(
            [i.get('id') for i in result],
            [i.id for i in sorted(expected, key=lambda c: -c.id)[x:y]]
        )

    def test_list_passes(self):
        commits = mommy.make(
            'monitor.Commit',
            repository=self.repo,
            _quantity=20
        )
        response = self.view.list(self.view.request, 'repo-name', 'repo-owner')
        data = response.data
        self.assertEqual(data['count'], 20)
        self.assertEqual(data['next'], 'http://fake-url?page=2')
        self.assertEqual(data['previous'], None)
        self.assertEqual(len(data['results']), 10)
        self.assertIDsMatch(data['results'], commits, 0, 10)

    def test_list_passes_with_empty_queryset(self):
        response = self.view.list(self.view.request, 'repo-name', 'repo-owner')
        data = response.data
        self.assertEqual(data['count'], 0)
        self.assertEqual(data['results'], [])

    def test_list_passes_without_pagination(self):
        commits = mommy.make(
            'monitor.Commit',
            repository=self.repo,
            _quantity=10
        )
        response = self.view.list(self.view.request, 'repo-name', 'repo-owner')
        data = response.data
        self.assertEqual(data['count'], 10)
        self.assertEqual(data['next'], None)
        self.assertEqual(data['previous'], None)
        self.assertEqual(len(data['results']), 10)
        self.assertIDsMatch(data['results'], commits, 0, 10)

    def test_list_fails_with_404(self):
        mommy.make(
            'monitor.Repository',
            name='repo-name2', owner='repo-owner2'
        )
        with self.assertRaises(Http404):
            self.view.list(
                self.view.request, 'repo-name2', 'repo-owner2'
            )


class TestRepositoryViewSet(TestViewSetMixin, TestCase):
    model = Repository
    view_set = RepositoryViewSet
    user_kwarg = 'users'


class TestCommitViewSet(TestViewSetMixin, TestCase):
    model = Commit
    view_set = CommitViewSet
    user_kwarg = 'repository__users'
