from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect


def login_redirect():
    return HttpResponseRedirect(reverse_lazy('users:login'))
