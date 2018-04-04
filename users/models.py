import re

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.core import validators
from django.db import models
from django.utils.translation import ugettext_lazy as _

from social_django.models import AbstractUserSocialAuth

from common.models import IndexedTimeStampedModel


class User(AbstractBaseUser, PermissionsMixin, IndexedTimeStampedModel):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=100, blank=True)
    username = models.CharField(
        max_length=255, unique=True,
        validators=[
            validators.RegexValidator(
                re.compile(r'^[\w.@+-]+$'),
                'O nome de usuário só pode conter letras, digitos ou os '
                'seguintes caracteres: @/./+/-/_', 'invalid'
            )
        ]
    )
    is_staff = models.BooleanField(
        default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    is_active = models.BooleanField(
        default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username


class GithubUser(AbstractUserSocialAuth, IndexedTimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name='github',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = 'Github User'
        verbose_name_plural = 'Github Users'
