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
