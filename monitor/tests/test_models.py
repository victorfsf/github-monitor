from django.test import TestCase

from model_mommy import mommy


class TestRepository(TestCase):

    def setUp(self):
        self.instance = mommy.make('monitor.Repository')

    def test_str(self):
        self.assertEqual(
            str(self.instance),
            f'{self.instance.owner}/{self.instance.name}'
        )

        self.instance.owner = None
        self.instance.name = None
        self.assertEqual(
            str(self.instance),
            f'None/None'
        )

        self.instance.owner = ''
        self.instance.name = ''
        self.assertEqual(
            str(self.instance), f'/'
        )

        self.instance.owner = 'owner'
        self.instance.name = 'name'
        self.assertEqual(
            str(self.instance), f'owner/name'
        )

    def tearDown(self):
        self.instance.delete()


class TestCommit(TestCase):

    def setUp(self):
        self.instance = mommy.make('monitor.Commit')

    def test_str(self):
        self.assertEqual(
            str(self.instance),
            f'{self.instance.sha} - {self.instance.author}'
        )

        self.instance.sha = None
        self.instance.author = None
        self.assertEqual(
            str(self.instance),
            f'None - None'
        )

        self.instance.sha = ''
        self.instance.author = ''
        self.assertEqual(
            str(self.instance), f' - '
        )

        self.instance.sha = 'sha'
        self.instance.author = 'author'
        self.assertEqual(
            str(self.instance), f'sha - author'
        )

    def tearDown(self):
        self.instance.delete()
