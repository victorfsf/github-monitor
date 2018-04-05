from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from users.utils import login_redirect


@login_required
def app_view(request):
    response = render(request, 'common/index.html')
    user_data = request.user.github.extra_data
    if user_data.get('access_token'):
        response.set_cookie(
            'accesstoken',
            request.user.github.extra_data.get('access_token')
        )
    else:
        return login_redirect()
    return response
