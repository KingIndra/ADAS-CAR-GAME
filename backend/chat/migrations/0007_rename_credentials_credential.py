# Generated by Django 4.2.5 on 2023-09-20 20:26

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0006_alter_credentials_email_otp'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Credentials',
            new_name='Credential',
        ),
    ]
