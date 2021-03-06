from django.test import Client, TestCase
from django.urls import reverse

from model_mommy import mommy


class TestCaseUtils(TestCase):

    def setUp(self):
        self._user_password = '123456'
        self.user = mommy.prepare('users.User', username='test_username')
        self.user.set_password(self._user_password)
        self.user.save()
        self.github_user = mommy.make(
            'users.GithubUser', user=self.user,
            extra_data={'access_token': '1234'}
        )
        self.auth_client = Client()
        self.auth_client.login(
            username=self.user.username,
            password=self._user_password
        )

    def get_client_without_github(self, is_superuser=False):
        user = mommy.prepare(
            'users.User',
            username='test_username2',
            is_superuser=is_superuser
        )
        user.set_password(self._user_password)
        user.save()
        client = Client()
        client.login(
            username=user.username,
            password=self._user_password
        )
        return client

    def tearDown(self):
        self.github_user.delete()
        self.user.delete()

    def reverse(self, name, *args, **kwargs):
        """ Reverse a url,
            convenience to avoid having to import reverse in tests
        """
        return reverse(name, args=args, kwargs=kwargs)

    def assertResponse200(self, response):
        """ Given response has status_code 200 OK"""
        self.assertEqual(response.status_code, 200)

    def assertResponse201(self, response):
        """ Given response has status_code 201 CREATED"""
        self.assertEqual(response.status_code, 201)

    def assertResponse301(self, response):
        """ Given response has status_code 301 MOVED PERMANENTLY"""
        self.assertEqual(response.status_code, 301)

    def assertResponse302(self, response):
        """ Given response has status_code 302 FOUND"""
        self.assertEqual(response.status_code, 302)

    def assertResponse400(self, response):
        """ Given response has status_code 400 BAD REQUEST"""
        self.assertEqual(response.status_code, 400)

    def assertResponse401(self, response):
        """ Given response has status_code 401 UNAUTHORIZED"""
        self.assertEqual(response.status_code, 401)

    def assertResponse403(self, response):
        """ Given response has status_code 403 FORBIDDEN"""
        self.assertEqual(response.status_code, 403)

    def assertResponse404(self, response):
        """ Given response has status_code 404 NOT FOUND"""
        self.assertEqual(response.status_code, 404)


class TestGetRequiresAuthenticatedUser:

    def test_get_requires_authenticated_user(self):
        response = self.client.get(self.view_url)
        self.assertResponse403(response)


class TestAuthGetRequestSuccess:

    def test_auth_get_success(self):
        response = self.auth_client.get(self.view_url)
        self.assertResponse200(response)
