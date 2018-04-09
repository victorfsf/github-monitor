from django.test import Client

from common.utils.tests import TestCaseUtils


class TestAppView(TestCaseUtils):

    def get_response(self):
        return self.auth_client.get(self.reverse('common:index'))

    def assertAccessToken302(self):
        response = self.get_response()
        self.assertResponse302(response)
        self.assertEqual(
            response.url, self.reverse('users:login')
        )

    def test_user_is_authenticated(self):
        url = self.reverse('common:index')
        response = self.auth_client.get(url)
        self.assertResponse200(response)

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
