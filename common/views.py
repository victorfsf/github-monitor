from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

from users.utils import login_redirect


@login_required
@ensure_csrf_cookie
def app_view(request):
    response = render(request, 'common/index.html')
    try:
        user_data = request.user.github.extra_data
    except ObjectDoesNotExist:
        if request.user.is_superuser:
            url = reverse_lazy('admin:index')
        else:
            url = reverse_lazy('users:logout')
        return HttpResponseRedirect(url)
    if user_data.get('access_token'):
        response.set_cookie(
            'accesstoken',
            request.user.github.extra_data.get('access_token')
        )
    else:
        return login_redirect()
    return response
