from urllib.parse import urljoin

from django.conf import settings
from django.core.urlresolvers import reverse
from django.db import transaction

import requests
from celery import task
from requests.exceptions import ConnectionError as RequestsConnectionError

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
        response = requests.post(
            f'{url}?access_token={access_token}', data=payload
        )
        if response.status_code not in [204, 100]:  # HTTP: [No Content, Continue]
            self.retry(exc=None, max_retries=3, countdown=30)
    except RequestsConnectionError as exc:
        self.retry(exc=exc, max_retries=5, countdown=30)


@task
def create_commits(repository_id, commits, sender, branch):
    cleaned_commits = ({
        'message': c['message'],
        'sha': c['id'],
        'date': c['timestamp'],
        'url': c['url'],
        'branch': branch,
        'repository_id': repository_id,
    } for c in commits)
    author = get_author(sender)
    with transaction.atomic():
        queryset = Commit.objects.select_for_update()
        for commit in cleaned_commits:
            commit['author'] = author
            queryset.update_or_create(
                sha=commit['sha'],
                repository_id=commit['repository_id'],
                defaults=commit
            )
