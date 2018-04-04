from django.test import TestCase

from model_mommy import mommy


class TestUser(TestCase):

    def setUp(self):
        self.instance = mommy.make('users.User', username='test_username')

    def test_get_full_name(self):
        self.assertEqual(
            self.instance.get_full_name(),
            self.instance.username
        )

    def test_get_short_name(self):
        self.assertEqual(
            self.instance.get_short_name(),
            self.instance.username
        )

    def test_str(self):
        self.assertEqual(
            str(self.instance),
            self.instance.username
        )

    def tearDown(self):
        self.instance.delete()


class TestGithubUser(TestCase):

    def setUp(self):
        self.user = mommy.make('users.User', username='test_username')
        self.instance = mommy.make('users.GithubUser', user=self.user)

    def test_str(self):
        self.assertEqual(
            str(self.instance),
            self.user.username
        )

    def tearDown(self):
        self.instance.delete()
        self.user.delete()
