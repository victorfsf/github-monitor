from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from django.shortcuts import render


@login_required
def app_view(request):
    response = render(request, 'common/index.html')
    try:
        request.user.github
    except ObjectDoesNotExist:
        if request.user.is_superuser:
            url = reverse_lazy('admin:index')
        else:
            url = reverse_lazy('users:logout')
        return HttpResponseRedirect(url)
    return response
