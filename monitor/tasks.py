from urllib.parse import urljoin

from django.conf import settings
from django.core.urlresolvers import reverse
from django.db import transaction

from requests import post
from requests.exceptions import ConnectionError  # pylint: disable=redefined-builtin
from celery import task

from monitor.models import Commit
from monitor.utils import get_author


@task(bind=True)
def create_github_hook(self, access_token, repository):
    url = urljoin(settings.GITHUB_API_URL, 'hub')
    repo_url = urljoin(settings.GITHUB_URL, f'{repository}/')
    try:
        payload = {
            'hub.mode': 'subscribe',
            'hub.topic': urljoin(repo_url, 'events/push'),
            'hub.callback': urljoin(settings.HOST, reverse('monitor:hub')),
            'hub.secret': settings.HUB_SECRET
        }
        response = post(
            f'{url}?access_token={access_token}', data=payload
        )
        if response.status_code not in [204, 100]:
            self.retry(exc=None, max_retries=3, countdown=30)
    except ConnectionError as exc:
        self.retry(exc=exc, max_retries=5, countdown=30)


@task
def create_commits(repository_id, commits, sender, branch):
    cleaned_commits = [{
        'message': c['message'],
        'sha': c['id'],
        'date': c['timestamp'],
        'url': c['url'],
        'branch': branch,
        'repository_id': repository_id,
    } for c in commits]
    author = get_author(sender)
    with transaction.atomic():
        queryset = Commit.objects.select_for_update()
        for commit in cleaned_commits:
            queryset.get_or_create(author=author, **commit)
