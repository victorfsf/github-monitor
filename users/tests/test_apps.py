from django.test import TestCase

from users.apps import UsersConfig


class TestUserConfig(TestCase):

    def test_name(self):
        self.assertEqual(
            UsersConfig.name,
            'users'
        )
