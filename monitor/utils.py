import hmac
from hashlib import sha1
from urllib.parse import urljoin

from django.conf import settings
from django.core.urlresolvers import reverse

import requests


def hub_signature_verify(value, expected):

    if not value or not expected:
        return False

    calc = hmac.new(settings.HUB_SECRET.encode(), value, sha1).hexdigest()
    return hmac.compare_digest(f'sha1={calc}', expected)


def create_github_hook(access_token, repository):
    url = urljoin(settings.GITHUB_API_URL, 'hub')
    repo_url = urljoin(settings.GITHUB_URL, repository)
    requests.post(
        f'{url}?access_token={access_token}', data={
            'hub.mode': 'subscribe',
            'hub.topic': urljoin(repo_url, 'events/push'),
            'hub.callback': urljoin(settings.HOST, reverse('monitor:hub')),
            'hub.secret': settings.HUB_SECRET
        }
    )
