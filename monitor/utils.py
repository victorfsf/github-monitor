import hmac
from hashlib import sha1

from django.conf import settings

from monitor.models import Author


def hub_signature_verify(value, expected):

    if not value or not expected:
        return False

    calc = hmac.new(settings.HUB_SECRET.encode(), value, sha1).hexdigest()
    return hmac.compare_digest(f'sha1={calc}', expected)


def get_author(payload):
    github_id = payload.get('id')
    kwargs = {
        'github_id': github_id
    } if github_id else {
        'email': payload.get('email')
    }
    author, _ = Author.objects.get_or_create(**kwargs)
    for field, value in payload.items():
        if value:
            setattr(author, field, value)
    author.save()
    return author
