from django.test import TestCase
from django.test.client import RequestFactory

from model_mommy import mommy

from common.site import GithubMonitorAdminSite
from users.admin import GithubUserAdmin


class TestGithubUserAdmin(TestCase):

    def setUp(self):
        factory = RequestFactory()
        self.user = mommy.make('users.User', username='test_username')
        self.github_user = mommy.make('users.GithubUser', user=self.user)
        self.admin = GithubUserAdmin(
            self.github_user, GithubMonitorAdminSite()
        )
        self.request = factory.get('/')

    def test_get_username(self):
        expected = self.user.username
        username = self.admin.get_username(self.github_user)
        self.assertEqual(expected, username)

    def tearDown(self):
        self.github_user.delete()
        self.user.delete()
