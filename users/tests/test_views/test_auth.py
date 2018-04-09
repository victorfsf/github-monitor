from unittest.mock import patch

from django.test import Client

from common.utils.tests import TestCaseUtils


@patch('django.middleware.csrf.get_token', lambda x: '5678')
class TestRetrieveTokens(TestCaseUtils):

    def test_get_when_github_user_exists(self):
        response = self.auth_client.get(self.reverse('users:tokens'))
        self.assertResponse200(response)
        self.assertEqual(response.json(), {
            'csrf': '5678',
            'access': '1234',
            'ok': True
        })

    def test_get_when_github_user_does_not_exist(self):
        client = self.get_client_without_github()
        response = client.get(self.reverse('users:tokens'))
        self.assertResponse403(response)
        self.assertEqual(response.json(), {
            'ok': False
        })


class TestLogin(TestCaseUtils):

    def test_user_is_authenticated(self):
        response = self.auth_client.get(self.reverse('users:login'))
        self.assertResponse302(response)
        self.assertEqual(response.url, self.reverse('common:index'))

    def test_user_is_not_authenticated(self):
        client = Client()
        response = client.get(self.reverse('users:login'))
        self.assertResponse200(response)
        self.assertEqual(response.template_name, ['common/index.html'])


class TestLogout(TestCaseUtils):

    def test_user_is_authenticated(self):
        response = self.auth_client.get(self.reverse('users:logout'))
        self.assertResponse302(response)
        self.assertEqual(response.url, self.reverse('users:login'))

    def test_user_is_not_authenticated(self):
        client = Client()
        response = client.get(self.reverse('users:logout'))
        self.assertResponse302(response)
        self.assertEqual(response.url, self.reverse('users:login'))
