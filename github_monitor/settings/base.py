# flake8: noqa
# https://docs.djangoproject.com/en/1.11/ref/settings/

import os
import sys

from decouple import config


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def base_dir_join(*args):
    return os.path.join(BASE_DIR, *args)

SITE_ID = 1

SECURE_HSTS_PRELOAD = True

HUB_SECRET = config('HUB_SECRET', default='hub-secret')

DEBUG = True

ADMINS = (
    ('Admin', 'foo@example.com'),
)

AUTH_USER_MODEL = 'users.User'

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_js_reverse',
    'webpack_loader',
    'import_export',
    'social_django',
    'rest_framework',

    'common',
    'users',
    'monitor'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware'
]

ROOT_URLCONF = 'github_monitor.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [base_dir_join('templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect'
            ],
        },
    },
]

WSGI_APPLICATION = 'github_monitor.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    }
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

AUTHENTICATION_BACKENDS = [
    'social_core.backends.github.GithubOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]

LOGIN_URL = 'users:login'

LOGOUT_URL = 'users:logout'

LOGIN_REDIRECT_URL = 'common:index'

LOGOUT_REDIRECT_URL = 'users:login'

SOCIAL_AUTH_GITHUB_KEY = 'b977200f1c3614415d94'

SOCIAL_AUTH_GITHUB_SECRET = 'c7bf5991dba288e71263a8908bc54a5fcda52bd7'

SOCIAL_AUTH_GITHUB_SCOPE = [
    'user:email', 'repo', 'admin:repo_hook'
]

SOCIAL_AUTH_STORAGE = 'users.storage.GithubSocialStorage'

GITHUB_API_URL = 'https://api.github.com/'
GITHUB_URL = 'https://github.com/'
GITHUB_AVATAR_URL = 'https://avatars1.githubusercontent.com/u/%(user_id)s?v=4'
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATICFILES_DIRS = (
    base_dir_join('assets'),
)

# Webpack
WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': False,  # on DEBUG should be False
        'STATS_FILE': base_dir_join('webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    },
    'JQUERY': {
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': 'jquery-webpack-stats.json',
    }
}

# Celery
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
