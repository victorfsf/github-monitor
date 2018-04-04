from django.test import Client

from common.utils.tests import TestCaseUtils


class TestAppView(TestCaseUtils):

    def test_user_is_authenticated(self):
        response = self.auth_client.get(self.reverse('common:index'))
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
