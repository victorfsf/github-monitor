from django.db import models
from django.utils.translation import ugettext_lazy as _

from common.models import IndexedTimeStampedModel


class Repository(IndexedTimeStampedModel):

    created_by = models.ForeignKey('users.User', verbose_name=_('created by'))
    name = models.CharField(_('name'), max_length=100)
    owner = models.ForeignKey(
        'users.GithubUser',
        verbose_name=_('owner')
    )

    def __str__(self):
        return f'{self.owner}/{self.name}'

    class Meta:
        verbose_name = 'Repository'
        verbose_name_plural = 'Repositories'


class Commit(IndexedTimeStampedModel):

    created_by = models.ForeignKey('users.User', verbose_name=_('created by'))
    message = models.TextField(_('message'))
    sha = models.CharField(_('SHA'), max_length=40)
    html_url = models.URLField(_('HTML Url'))
    date = models.DateTimeField(_('date'))
    repository = models.ForeignKey(
        'monitor.Repository',
        verbose_name=_('repository')
    )
    author = models.ForeignKey(
        'users.GithubUser',
        verbose_name=_('author')
    )

    def __str__(self):
        return f'{self.sha} - {self.author_login}'

    class Meta:
        verbose_name = 'Commit'
        verbose_name_plural = 'Commits'
