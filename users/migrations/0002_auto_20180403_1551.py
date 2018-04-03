# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-03 15:51
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='githubuser',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='github', to=settings.AUTH_USER_MODEL),
        ),
    ]
