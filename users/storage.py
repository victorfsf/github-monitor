from social_django.models import DjangoStorage

from users.models import GithubUser


class GithubSocialStorage(DjangoStorage):
    user = GithubUser
