from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from monitor.decorators import hub_signature_required


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(hub_signature_required, name='dispatch')
class HubWebhookView(View):

    def post(self, request, *args, **kwargs):
        # TODO: Add new commits
        return JsonResponse({'ok': True})


hub_webhook_view = HubWebhookView.as_view()
