from django.test import Client

from common.utils.tests import TestCaseUtils


class TestLogin(TestCaseUtils):

    def test_user_is_authenticated(self):
        response = self.auth_client.get(self.reverse('users:login'))
        self.assertResponse302(response)
        self.assertEqual(response.url, self.reverse('common:index'))

    def test_user_is_not_authenticated(self):
        client = Client()
        response = client.get(self.reverse('users:login'))
        self.assertResponse200(response)
        self.assertEqual(response.template_name, ['users/login.html'])


class TestLogout(TestCaseUtils):

    def test_user_is_authenticated(self):
        response = self.auth_client.get(self.reverse('users:logout'))
        self.assertResponse302(response)
        self.assertEqual(response.url, self.reverse('users:login'))
        self.assertEqual(
            response.cookies.get('accesstoken').value, ''
        )

    def test_user_is_not_authenticated(self):
        client = Client()
        response = client.get(self.reverse('users:logout'))
        self.assertResponse302(response)
        self.assertEqual(response.url, self.reverse('users:login'))
