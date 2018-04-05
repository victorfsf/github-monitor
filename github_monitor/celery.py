import os

from django.apps import apps

import decouple
from celery import Celery


os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE', decouple.config('DJANGO_SETTINGS_MODULE')
)

app = Celery('github_monitor_tasks')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])
