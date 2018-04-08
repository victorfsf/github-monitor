from copy import deepcopy
from unittest.mock import MagicMock, patch

from django.core.exceptions import FieldError
from django.test import TestCase
from django.utils import timezone

from model_mommy import mommy

from monitor.serializers import AuthorSerializer, CommitSerializer, RepositorySerializer


class TestAuthorSerializer(TestCase):

    def setUp(self):
        self.serializer_class = AuthorSerializer

    def test_is_valid(self):
        serializer = self.serializer_class(data={
            'github_id': 1,
            'name': 'Author\'s name',
            'login': 'authorlogin',
            'email': 'author@github.com',
        })
        self.assertTrue(serializer.is_valid())

    def test_is_not_valid(self):
        serializer = self.serializer_class(data={
            'github_id': 1,
            'name': 'Author\'s name',
            'login': 'authorlogin',
            'email': None,
        })
        self.assertFalse(serializer.is_valid())


class TestCommitSerializer(TestCase):

    def setUp(self):
        self.serializer_class = CommitSerializer

    def test_is_valid(self):
        serializer = self.serializer_class(data={
            'message': 'commit message',
            'sha': 'c8fcfea160a6e5af6bdaffaf2bf5a3a5ca98b2f2',
            'date': timezone.now(),
            'url': 'https://github.com/',
            'branch': 'master',
            'author': {
                'github_id': 1,
                'name': 'Author\'s name',
                'login': 'authorlogin',
                'email': 'author@github.com',
            }
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
                'branch': 'master',
                'author': {
                    'github_id': i % 2,
                    'name': f'Author\'s name',
                    'login': f'authorlogin{i % 2}',
                    'email': f'author{i % 2}@github.com',
                }
            } for i in range(10)]
        }
        self.user = mommy.make(
            'users.User'
        )
        mommy.make(
            'users.GithubUser',
            extra_data={'access_token': '1234'},
            user=self.user
        )
        self.repo = mommy.make(
            'monitor.Repository', owner='repo_owner', name='repo-name'
        )

    def get_serializer_with_request(self):
        request = MagicMock()
        request.user = self.user
        return self.serializer_class(context={'request': request})

    @patch('monitor.serializers.RepositorySerializer.create_or_update')
    def test_create(self, create_or_update):
        serializer = self.serializer_class()
        serializer.create(self.valid_data)
        create_or_update.assert_called_with(self.valid_data)

    @patch('monitor.tasks.create_github_hook.delay')
    @patch('monitor.serializers.RepositorySerializer.create_or_update')
    def test_create_with_request(self, create_or_update, delay):
        create_or_update.return_value = self.repo
        serializer = self.get_serializer_with_request()
        serializer.create(self.valid_data)
        create_or_update.assert_called_with(self.valid_data)
        delay.assert_called_with(
            self.user.github.access_token, str(self.repo)
        )

    @patch('monitor.serializers.RepositorySerializer.create_or_update')
    def test_update(self, create_or_update):
        serializer = self.serializer_class()
        serializer.update(self.repo, self.valid_data)
        create_or_update.assert_called_with(
            self.valid_data, instance=self.repo
        )

    def test_create_or_update_with_instance(self):
        serializer = self.serializer_class()
        data = deepcopy(self.valid_data)
        repo = mommy.make('monitor.Repository')
        self.assertEqual(
            repo, serializer.create_or_update(data, instance=repo)
        )
        repo.delete()

    def test_create_or_update_without_request(self):
        serializer = self.serializer_class()
        data = deepcopy(self.valid_data)
        repo = serializer.create_or_update(data)

        self.assertEqual(repo.users.count(), 0)
        self.assertEqual(repo.owner, data['owner'])
        self.assertEqual(repo.name, data['name'])
        self.assertFalse('commits' in data)

        commits = sorted(self.valid_data['commits'], key=lambda d: d['date'])
        qs = repo.commits.order_by('date')
        for expected, commit in zip(commits, qs):
            serialized = CommitSerializer(commit).data
            serialized.pop('id')
            serialized['author'] = dict(serialized['author'])
            serialized['author'].pop('id')
            expected['date'] = expected['date'].isoformat().replace('+00:00', 'Z')
            expected['repository'] = f'{data["owner"]}/{data["name"]}'
            self.assertEqual(expected, serialized)

    def test_create_or_update_with_request(self):
        serializer = self.get_serializer_with_request()
        data = deepcopy(self.valid_data)
        repo = serializer.create_or_update(data)

        self.assertEqual(repo.users.count(), 1)

    def test_create_or_update_without_commits(self):
        serializer = self.serializer_class()
        data = deepcopy(self.valid_data)
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
        data = deepcopy(self.valid_data)
        first = serializer.create_or_update(data)
        repo = serializer.create_or_update(data)
        self.assertEqual(repo.id, first.id)

    def test_dont_create_existing_commit(self):
        serializer = self.serializer_class()
        data = deepcopy(self.valid_data)
        first = serializer.create_or_update(data)

        new_data = deepcopy(self.valid_data)
        new_data['commits'] = self.valid_data['commits'] + [{
            'message': f'another commit {i}',
            'sha': f'another{i}',
            'date': timezone.now(),
            'url': 'https://github.com/',
            'author': f'another author 1-{i}'
        } for i in range(5)]
        repo = serializer.create_or_update(new_data)

        self.assertEqual(
            repo.commits.order_by('sha').distinct('sha').count(),
            first.commits.count()
        )
