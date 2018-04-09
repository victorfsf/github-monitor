from django.contrib.auth import views as auth_views
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from django.middleware import csrf

from rest_framework.response import Response
from rest_framework.views import APIView

from users.utils import login_redirect


class RetrieveTokens(APIView):

    def get(self, request):
        try:
            user = request.user.github
            return Response({
                'csrf': csrf.get_token(request),
                'access': user.access_token,
                'ok': True
            })
        except ObjectDoesNotExist:
            return Response({
                'ok': False,
            }, status=403)


def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse_lazy('common:index'))
    return auth_views.login(
        request, template_name='common/index.html'
    )


def logout(request):
    if request.user.is_authenticated():
        response = auth_views.logout(request)
        response.delete_cookie('accesstoken')
        return response
    return login_redirect()


retrieve_tokens = RetrieveTokens.as_view()
