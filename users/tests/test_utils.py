from django.test import TestCase
from users.utils import login_redirect
from django.core.urlresolvers import reverse


class TestLoginRedirect(TestCase):

    def test_call(self):
        response = login_redirect()
        self.assertEqual(response.url, reverse('users:login'))
        self.assertEqual(response.status_code, 302)
