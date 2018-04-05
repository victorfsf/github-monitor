from unittest.mock import MagicMock, patch

from django.core.exceptions import FieldError
from django.test import TestCase
from django.utils import timezone

from model_mommy import mommy

from monitor.models import Commit
from monitor.serializers import CommitSerializer, OrderByDateSerializer, RepositorySerializer


class TestOrderByDateSerializer(TestCase):

    def setUp(self):
        self.serializer_class = OrderByDateSerializer

    def test_to_representation(self):
        commits = Commit.objects.filter(
            id__in=(i.id for i in mommy.make('monitor.Commit', _quantity=10))
        )
        child = CommitSerializer()
        serializer = self.serializer_class(child=child)
        ordered = [c['id'] for c in serializer.to_representation(commits)]
        expected = list(
            commits.order_by('-date').values_list('id', flat=True)
        )
        self.assertEqual(ordered, expected)

    def test_to_representation_not_queryset(self):
        commits = [{
            'id': i, 'message': f'test', 'sha': '1234',
            'url': 'https://github.com/',
            'date': timezone.now(), 'author': 'me'
        } for i in range(10)]
        child = CommitSerializer()
        serializer = self.serializer_class(child=child)

        expected = [c['id'] for c in commits]
        ordered = [c['id'] for c in serializer.to_representation(commits)]
        self.assertEqual(expected, ordered)

    def test_is_valid(self):
        serializer = self.serializer_class(data=[], child=CommitSerializer())
        self.assertTrue(serializer.is_valid())


class TestCommitSerializer(TestCase):

    def setUp(self):
        self.serializer_class = CommitSerializer

    def test_is_valid(self):
        serializer = self.serializer_class(data={
            'message': 'commit message',
            'sha': 'c8fcfea160a6e5af6bdaffaf2bf5a3a5ca98b2f2',
            'date': timezone.now(),
            'url': 'https://github.com/',
            'author': 'commitauthor'
        })
        self.assertTrue(serializer.is_valid())

    def test_is_not_valid(self):
        serializer = self.serializer_class(data={
            'sha': 'c8fcfea160a6e5af6bdaffaf2bf5a3a5ca98b2f2',
            'date': timezone.now(),
            'url': 'https://github.com/',
            'author': 'commitauthor'
        })
        self.assertFalse(serializer.is_valid())

        serializer = self.serializer_class(data={
            'message': '',
            'sha': '',
            'date': None,
            'url': '',
            'author': ''
        })
        self.assertFalse(serializer.is_valid())


class TestRepositorySerializer(TestCase):

    def setUp(self):
        self.serializer_class = RepositorySerializer
        self.valid_data = {
            'owner': 'repo_owner',
            'name': 'repo-name',
            'commits': [{
                'message': f'commit {i}',
                'sha': str(i),
                'date': timezone.now(),
                'url': 'https://github.com/',
                'author': f'author {i}'
            } for i in range(10)]
        }
        self.user = mommy.make('users.User')
        self.repo = mommy.make(
            'monitor.Repository', owner='repo_owner', name='repo-name'
        )

    @patch('monitor.serializers.RepositorySerializer.create_or_update')
    def test_create(self, create_or_update):
        serializer = self.serializer_class()
        serializer.create(self.valid_data)
        create_or_update.assert_called_with(self.valid_data)

    @patch('monitor.serializers.RepositorySerializer.create_or_update')
    def test_update(self, create_or_update):
        serializer = self.serializer_class()
        serializer.update(self.repo, self.valid_data)
        create_or_update.assert_called_with(
            self.valid_data, instance=self.repo
        )

    def test_create_or_update_with_instance(self):
        serializer = self.serializer_class()
        data = self.valid_data.copy()
        repo = mommy.make('monitor.Repository')
        self.assertEqual(
            repo, serializer.create_or_update(data, instance=repo)
        )
        repo.delete()

    def test_create_or_update_without_request(self):
        serializer = self.serializer_class()
        data = self.valid_data.copy()
        repo = serializer.create_or_update(data)

        self.assertEqual(repo.users.count(), 0)
        self.assertEqual(repo.owner, data['owner'])
        self.assertEqual(repo.name, data['name'])
        self.assertFalse('commits' in data)

        commits = sorted(self.valid_data['commits'], key=lambda d: d['date'])
        qs = repo.commits.order_by('date').values(
            'message', 'sha', 'date', 'url', 'author'
        )
        for expected, commit in zip(commits, qs):
            self.assertEqual(expected, commit)

    def test_create_or_update_with_request(self):
        request = MagicMock()
        request.user = self.user
        serializer = self.serializer_class(context={'request': request})
        data = self.valid_data.copy()
        repo = serializer.create_or_update(data)
        self.assertEqual(repo.users.count(), 1)

    def test_create_or_update_without_commits(self):
        serializer = self.serializer_class()
        data = self.valid_data.copy()
        data.pop('commits')
        repo = serializer.create_or_update(data)
        self.assertEqual(repo.commits.count(), 0)

    def test_create_or_update_raises_field_error(self):
        serializer = self.serializer_class()
        data = {
            'name': None,
            'author': 'author\'s name'
        }
        with self.assertRaises(FieldError):
            serializer.create_or_update(data)

    def test_dont_create_existing_repository(self):
        serializer = self.serializer_class()
        data = self.valid_data.copy()
        first = serializer.create_or_update(data)
        repo = serializer.create_or_update(data)
        self.assertEqual(repo.id, first.id)

    def test_dont_create_existing_commit(self):
        serializer = self.serializer_class()
        data = self.valid_data.copy()
        first = serializer.create_or_update(data)

        new_data = data.copy()
        new_data['commits'] = self.valid_data['commits'] + [{
            'message': f'another commit {i}',
            'sha': f'another{i}',
            'date': timezone.now(),
            'url': 'https://github.com/',
            'author': f'another author 1-{i}'
        } for i in range(5)]
        repo = serializer.create_or_update(new_data)

        self.assertEqual(
            repo.commits.distinct('sha').count(),
            first.commits.count()
        )

    def tearDown(self):
        self.repo.commits.all().delete()
        self.repo.delete()
