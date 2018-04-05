import hmac
from hashlib import sha1

from django.conf import settings


def hub_signature_verify(value, expected):

    if not value or not expected:
        return False

    calc = hmac.new(settings.HUB_SECRET.encode(), value, sha1).hexdigest()
    return hmac.compare_digest(f'sha1={calc}', expected)


# def create_github_hook(user, repository):
#     # TODO: Write a "create hook" request
#     pass
