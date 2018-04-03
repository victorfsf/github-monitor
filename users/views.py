from django.contrib.auth.views import login as login_view
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect


def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(
            # TODO: Redirect to the main page instead
            reverse_lazy('admin:index')
        )
    return login_view(
        request, template_name='users/login.html'
    )
