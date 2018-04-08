import json
from unittest.mock import patch

from model_mommy import mommy

from common.utils.tests import TestCaseUtils
from monitor.models import Repository


@patch('monitor.utils.hub_signature_verify', lambda *a: True)
class TestHubWebhookView(TestCaseUtils):

    def setUp(self):
        super().setUp()
        self.repo = mommy.make(
            'monitor.Repository',
            name='repo-name', owner='repo-owner'
        )
        base_payload = {
            'repository': {
                'full_name': str(self.repo)
            }
        }
        self.hook_payload = {
            'hook_id': 1, **base_payload
        }
        self.commits_payload = {
            'sender': {
                'login': 'repo-owner',
                'id': 1
            },
            'ref': 'refs/heads/master',
            'commits': [{
                'author': {
                    'name': 'author',
                    'email': 'author@github.com'
                }
            }], **base_payload
        }

    def make_request(self, payload):
        return self.auth_client.post(
            self.reverse('monitor:hub'),
            data={
                'payload': json.dumps(payload)
            },
        )

    def assertJson404(self, response):
        self.assertEqual(response.json(), {'ok': False, 'status': 404})

    def test_post_create_hook(self):
        response = self.make_request(self.hook_payload)
        self.assertResponse201(response)
        self.assertEqual(response.json(), {'ok': True, 'created': True})
        self.assertIsNotNone(Repository.objects.get(id=self.repo.id).hook)

    @patch('monitor.tasks.create_commits.delay')
    def test_post_create_commits(self, delay):
        response = self.make_request(self.commits_payload)
        self.assertResponse200(response)
        self.assertEqual(response.json(), {'ok': True, 'created': False})
        delay.assert_called_with(
            self.repo.id,
            self.commits_payload['commits'], {
                'name': 'author', 'email': 'author@github.com',
                'login': 'repo-owner', 'id': 1
            }, 'master'
        )

    @patch('monitor.tasks.create_commits.delay')
    def test_post_create_commits_empty(self, delay):
        payload = self.commits_payload
        payload['commits'] = []
        response = self.make_request(payload)
        self.assertResponse200(response)
        self.assertEqual(response.json(), {'ok': True, 'created': False})
        delay.assert_not_called()

    def test_post_commits_is_none(self):
        payload = self.commits_payload
        payload.pop('commits')
        response = self.make_request(payload)
        self.assertResponse404(response)
        self.assertJson404(response)

    def test_post_repository_doesnt_exist(self):
        payload = self.commits_payload
        payload['repository']['full_name'] = 'owner/name'
        response = self.make_request(payload)
        self.assertResponse404(response)
        self.assertJson404(response)

    def test_post_repository_not_in_payload(self):
        payload = self.commits_payload
        payload.pop('repository')
        response = self.make_request(payload)
        self.assertResponse404(response)
        self.assertJson404(response)
