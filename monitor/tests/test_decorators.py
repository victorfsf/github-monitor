from unittest.mock import MagicMock, patch

from django.test import TestCase

from monitor.decorators import hub_signature_required


class TestHubSignatureRequired(TestCase):

    def fn_to_test(self, request):
        return request.body

    def setUp(self):
        self.decorator = hub_signature_required
        self.signature = 'sha=signature'
        self.request = MagicMock()
        self.request.body = 'request test body'
        self.request.META = {
            'HTTP_X_HUB_SIGNATURE': self.signature
        }

    @patch('monitor.utils.hub_signature_verify')
    def test_passes(self, hub_signature_verify):
        hub_signature_verify.return_value = True
        result = self.decorator(self.fn_to_test)(self.request)
        hub_signature_verify.assert_called_with(
            self.request.body, self.signature
        )
        self.assertEqual(result, self.request.body)

    @patch('monitor.utils.hub_signature_verify')
    def test_fails(self, hub_signature_verify):
        hub_signature_verify.return_value = False
        result = self.decorator(self.fn_to_test)(self.request)
        hub_signature_verify.assert_called_with(
            self.request.body, self.signature
        )
        self.assertEqual(result.status_code, 403)
