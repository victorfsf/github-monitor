from django.contrib.auth import views as auth_views
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect

from users.utils import login_redirect


def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse_lazy('common:index'))
    return auth_views.login(
        request, template_name='users/login.html'
    )


def logout(request):
    if request.user.is_authenticated():
        response = auth_views.logout(request)
        response.delete_cookie('accesstoken')
        return response
    return login_redirect()
