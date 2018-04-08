from unittest.mock import patch
from urllib.parse import urljoin

from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import TestCase

from model_mommy import mommy
from requests.exceptions import ConnectionError as RequestsConnectionError

from monitor.models import Commit
from monitor.tasks import create_commits, create_github_hook


class TestCreateGithubHook(TestCase):

    def setUp(self):
        self.task = create_github_hook
        self.url = urljoin(settings.GITHUB_API_URL, 'hub')

    def make_payload(self, repo):
        repo_url = urljoin(settings.GITHUB_URL, f'{repo}/')
        return {
            'hub.mode': 'subscribe',
            'hub.topic': urljoin(repo_url, 'events/push'),
            'hub.callback': urljoin(settings.HOST, reverse('monitor:hub')),
            'hub.secret': settings.HUB_SECRET
        }

    @patch('requests.post')
    @patch('monitor.tasks.create_github_hook.retry')
    def _test_passes_with_code(self, code, retry, post):
        post().status_code = code
        self.task('1234', 'owner/name')  # pylint: disable=no-value-for-parameter
        retry.assert_not_called()
        post.assert_called_with(
            f'{self.url}?access_token=1234',
            data=self.make_payload('owner/name')
        )

    def test_task_passes_with_204(self):
        self._test_passes_with_code(204)  # pylint: disable=no-value-for-parameter

    def test_task_passes_with_100(self):
        self._test_passes_with_code(100)  # pylint: disable=no-value-for-parameter

    @patch('requests.post')
    @patch('monitor.tasks.create_github_hook.retry')
    def test_task_fails_with_422(self, retry, post):
        post().status_code = 422
        self.task('1234', 'owner/name')  # pylint: disable=no-value-for-parameter
        retry.assert_called_with(exc=None, max_retries=3, countdown=30)

    @patch('requests.post')
    @patch('monitor.tasks.create_github_hook.retry')
    def test_task_fails_with_connection_error(self, retry, post):
        exc = RequestsConnectionError()
        post.side_effect = exc
        self.task('1234', 'owner/name')  # pylint: disable=no-value-for-parameter
        retry.assert_called_with(exc=exc, max_retries=5, countdown=30)


class TestCreateCommits(TestCase):

    def setUp(self):
        self.task = create_commits
        self.repo = mommy.make('monitor.Repository')
        self.branch = 'master'
        self.commits = [self.make_commit(i) for i in range(10)]
        self.sender = {
            'id': 1,
            'email': 'author@github.com',
            'name': 'Author Name',
            'login': 'auhtor'
        }

    def make_commit(self, i):
        return {
            'message': f'commit {i}',
            'id': i,
            'timestamp': f'2018-04-07T22:53:1{i}Z',
            'url': 'https://github.com/',
            'repository_id': self.repo.id
        }

    def test_task_passes_with_all_new_commits(self):
        commits_qtt = Commit.objects.count()
        self.task(self.repo.id, self.commits, self.sender, self.branch)
        self.assertEqual(Commit.objects.count() - commits_qtt, 10)

    def test_task_passes_with_half_commits(self):
        commits_qtt = Commit.objects.count()
        commits = [self.make_commit(i) for i in range(5)] * 2
        self.task(self.repo.id, commits, self.sender, self.branch)
        self.assertEqual(Commit.objects.count() - commits_qtt, 5)

    def test_task_passes_without_commits(self):
        commits_qtt = Commit.objects.count()
        self.task(self.repo.id, [], self.sender, self.branch)
        self.assertEqual(Commit.objects.count(), commits_qtt)

    def test_task_passes_with_one_commit(self):
        commits_qtt = Commit.objects.count()
        commits = [self.make_commit(1)] * 20
        self.task(self.repo.id, commits, self.sender, self.branch)
        self.assertEqual(Commit.objects.count() - commits_qtt, 1)
