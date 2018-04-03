from django.contrib.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from common.site import register
from users.models import GithubUser

from .models import User


@register(User)
class CustomUserAdmin(UserAdmin):

    list_display = ('id', 'email', 'username', 'created', 'modified')
    list_filter = ('is_active', 'is_staff', 'groups')
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}),
    )


@register(GithubUser)
class GithubUserAdmin(ModelAdmin):

    list_display = ('get_username', 'id', 'uid')
    list_select_related = ('user', )
    fieldsets = (
        (_('Management'), {'fields': ('user', 'uid', 'extra_data')}),
    )
    readonly_fields = ('uid', 'extra_data')
    raw_id_fields = ('user', )

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
