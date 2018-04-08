ARG := $(word 2, $(MAKECMDGOALS) )


clean:
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete

test:
	pipenv run python manage.py test $(ARG) --parallel --keepdb

testreset:
	pipenv run python manage.py test $(ARG) --parallel

coverage:
	pipenv run coverage run --source='.' manage.py test $(ARG) && coverage html

isort:
	isort -rc . -s "node_modules/" -s "*/migrations/*"

celery:
	celery -A github_monitor worker -l info -c 10 -E

celery.purge:
	@echo "from celery.task.control import discard_all; discard_all()" | \
		python manage.py shell

celery.kill:
	@ps -ef | grep celery | awk '{print $$2}' | xargs kill -9
