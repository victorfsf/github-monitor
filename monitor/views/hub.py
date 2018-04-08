import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from monitor.decorators import hub_signature_required
from monitor.models import Repository
from monitor.tasks import create_commits


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(hub_signature_required, name='dispatch')
class HubWebhookView(View):

    def get_payload(self, request):
        return json.loads(request.POST['payload'])

    def response_404(self):
        return JsonResponse({
            'ok': False,
            'status': 404
        }, status_code=404)

    def post(self, request, *args, **kwargs):
        payload = self.get_payload(request)
        if 'repository' not in payload:
            return self.response_404()

        owner, name = payload.get('repository').get('full_name').split('/')
        try:
            repository = Repository.objects.get(name=name, owner=owner)
        except Repository.DoesNotExist:
            return self.response_404()

        hook_id = payload.get('hook_id')
        commits = payload.get('commits')
        created = False
        if hook_id:
            created = True
            self.create_hook(
                repository, hook_id
            )
        elif commits is not None:
            self.create_commits(
                repository, commits, payload.get('sender'),
                branch=payload.get('ref').replace('refs/heads/', '')
            )
        else:
            return self.response_404()
        return JsonResponse({'ok': True, 'created': created})

    def create_hook(self, repository, hook_id):
        repository.hook = hook_id
        repository.save()

    def create_commits(self, repository, commits, sender, branch):
        if commits:
            author = commits[0].get('author', {}).copy()
            author.update(sender)
            create_commits.delay(repository.id, commits, author, branch)


hub_webhook_view = HubWebhookView.as_view()
