from functools import wraps

from django.http import HttpResponseForbidden

from monitor.utils import hub_signature_verify


def hub_signature_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        expected = request.META.get('HTTP_X_HUB_SIGNATURE')
        if not hub_signature_verify(request.body, expected):
            return HttpResponseForbidden('Signatures don\'t match.')
        return func(request, *args, **kwargs)
    return wrapper
