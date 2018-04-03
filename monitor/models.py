from django.db import models
from django.utils.translation import ugettext_lazy as _

from common.models import IndexedTimeStampedModel


class Repository(IndexedTimeStampedModel):

    users = models.ManyToManyField(
        'users.User', related_name='repositories'
    )
    name = models.CharField(max_length=100)
    owner = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.owner}/{self.name}'

    class Meta:
        verbose_name = 'Repository'
        verbose_name_plural = 'Repositories'


class Commit(IndexedTimeStampedModel):

    message = models.TextField(_('message'))
    sha = models.CharField(_('SHA'), max_length=40)
    html_url = models.URLField(_('HTML Url'))
    date = models.DateTimeField(_('date'))
    author = models.CharField(max_length=255)
    repository = models.ForeignKey(
        'monitor.Repository',
        related_name='commits',
        verbose_name=_('repository')
    )

    def __str__(self):
        return f'{self.sha} - {self.author}'

    class Meta:
        verbose_name = 'Commit'
        verbose_name_plural = 'Commits'
