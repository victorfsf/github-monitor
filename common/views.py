from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from django.shortcuts import render

from users.utils import login_redirect


@login_required
def app_view(request):
    response = render(request, 'common/index.html')
    try:
        user_data = request.user.github.extra_data
    except ObjectDoesNotExist:
        return HttpResponseRedirect(reverse_lazy('users:logout'))
    if user_data.get('access_token'):
        response.set_cookie(
            'accesstoken',
            request.user.github.extra_data.get('access_token')
        )
    else:
        return login_redirect()
    return response
