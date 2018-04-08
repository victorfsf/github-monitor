from django.conf import settings
from django.test import TestCase

from monitor.models import Author
from monitor.utils import get_author, hub_sign, hub_signature_verify


class TestHubSignatureVerify(TestCase):

    def setUp(self):
        self.fn = hub_signature_verify
        self.secret = settings.HUB_SECRET

    def make_cases(self, body, secret):
        signature = hub_sign(body, secret)
        return body, f'sha1={signature}'

    def test_passes(self):
        body, expected = self.make_cases(b'request body', self.secret)
        self.assertTrue(self.fn(body, expected))

    def test_fails_different_secret(self):
        body, expected = self.make_cases(b'request body', 'different secret')
        self.assertFalse(self.fn(body, expected))

    def test_fails_different_body(self):
        _, expected = self.make_cases(b'different body', self.secret)
        self.assertFalse(self.fn(b'request body', expected))

    def test_value_is_empty(self):
        self.assertFalse(self.fn(None, 'expected'))

    def test_expected_is_empty(self):
        self.assertFalse(self.fn('value', None))


class TestGetAuthor(TestCase):

    def setUp(self):
        self.fn = get_author
        self.payloads = [{
            'id': 1,
            'email': 'author1@github.com',
            'name': 'Author Name',
            'login': 'author 1'
        }, {
            'github_id': 2,
            'email': 'author2@github.com',
            'name': 'Author Name',
            'login': 'author 2'
        }, {
            'email': 'author3@github.com',
            'name': 'Author Name',
            'login': 'author 3'
        }, {
            'email': 'author4@github.com',
            'name': 'Author Name',
        }]

    def _test_author(self, payload, id_key='id', author=None):
        if not author:
            author = self.fn(payload)
        result = {
            'email': author.email,
            'name': author.name,
        }
        if author.github_id:
            result[id_key] = author.github_id
        if author.login:
            result['login'] = author.login
        self.assertEqual(result, payload)

    def _test_update_author(self, payload, field, key=None, id_key='id'):
        author = Author.objects.get(**{field: payload[key or field]})
        result = self.fn(payload)
        self.assertEqual(result.id, author.id)
        self._test_author(payload, author=result, id_key=id_key)

    def test_first_payload(self):
        self._test_author(self.payloads[0])
        self._test_update_author(self.payloads[0], 'github_id', 'id')

    def test_second_payload(self):
        self._test_author(self.payloads[1], id_key='github_id')
        self._test_update_author(
            self.payloads[1], 'github_id', id_key='github_id'
        )

    def test_third_payload(self):
        self._test_author(self.payloads[2])
        self._test_update_author(self.payloads[2], 'email')

    def test_fourth_payload(self):
        self._test_author(self.payloads[3])
        self._test_update_author(self.payloads[3], 'email')
