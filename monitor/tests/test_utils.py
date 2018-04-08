import hmac
from hashlib import sha1

from django.conf import settings
from django.test import TestCase

from monitor.utils import hub_signature_verify


class TestHubSignatureVerify(TestCase):

    def setUp(self):
        self.fn = hub_signature_verify
        self.secret = settings.HUB_SECRET

    def make_cases(self, body, secret):
        signature = hmac.new(secret.encode(), body, sha1).hexdigest()
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
