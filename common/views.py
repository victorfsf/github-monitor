from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def app_view(request):
    response = render(request, 'common/index.html')
    # TODO: response.set_cookie
    return response
