web: gunicorn github_monitor.wsgi --limit-request-line 8188 --log-file -
worker: celery worker --app=github_monitor --loglevel=info
