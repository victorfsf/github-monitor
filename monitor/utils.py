import hmac
from hashlib import sha1

from django.conf import settings

from monitor.models import Author


def hub_sign(value, secret=settings.HUB_SECRET):
    return hmac.new(secret.encode(), value, sha1).hexdigest()


def hub_signature_verify(value, expected):

    if not value or not expected:
        return False

    calc = hub_sign(value)
    return hmac.compare_digest(f'sha1={calc}', expected)


def get_author(payload):
    if not isinstance(payload, dict):
        return None

    github_id = payload.get('id') or payload.get('github_id')
    email = payload.get('email')
    kwargs = {
        'github_id': github_id
    } if github_id else {
        'email': email
    }
    kwargs['defaults'] = {
        'github_id': github_id,
        'email': email,
        'name': payload.get('name'),
        'login': payload.get('login')
    }
    author, _ = Author.objects.update_or_create(**kwargs)
    return author
