from django.test import Client

from model_mommy import mommy

from common.utils.tests import TestCaseUtils


class TestAppView(TestCaseUtils):

    def get_response(self):
        return self.auth_client.get(self.reverse('common:index'))

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

    def assertAccessToken302(self):
        response = self.get_response()
        self.assertResponse302(response)
        self.assertEqual(
            response.url, self.reverse('users:login')
        )

    def test_cookies_with_accesstoken(self):
        self.github_user.extra_data = {
            'access_token': '1234'
        }
        self.github_user.save()
        response = self.get_response()
        self.assertResponse200(response)
        self.assertEqual(
            response.cookies.get('accesstoken').value, '1234'
        )

    def test_cookies_without_accesstoken(self):
        self.github_user.extra_data = {}
        self.github_user.save()
        self.assertAccessToken302()

    def test_cookies_with_empty_accesstoken(self):
        self.github_user.extra_data = {
            'access_token': None
        }
        self.github_user.save()
        self.assertAccessToken302()

    def test_user_is_not_authenticated(self):
        client = Client()
        url = self.reverse('common:index')
        response = client.get(url)
        self.assertResponse302(response)
        self.assertEqual(
            response.url,
            f'{self.reverse("users:login")}?next={url}'
        )

    def test_user_is_authenticated_without_github(self):
        client = self.get_client_without_github()
        response = client.get(self.reverse('common:index'))
        self.assertResponse302(response)
        self.assertEqual(
            response.url,
            self.reverse('users:logout')
        )

    def test_user_is_superuser_without_github(self):
        client = self.get_client_without_github(is_superuser=True)
        response = client.get(self.reverse('common:index'))
        self.assertResponse302(response)
        self.assertEqual(
            response.url,
            self.reverse('admin:index')
        )
