from django.contrib.admin import AdminSite
from django.contrib.admin import register as _register
from functools import partial


class GithubMonitorAdminSite(AdminSite):

    site_title = 'Admin | Github Monitor'
    site_header = 'Github Monitor Administration'
    index_title = 'Modules'


admin = GithubMonitorAdminSite(name='Github Monitor')
register = partial(_register, site=admin)
