# Generated by Django 4.2.5 on 2023-09-24 12:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0005_rename_users_thread_thread_users_thread_thread_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='thread',
            old_name='thread_users',
            new_name='users',
        ),
        migrations.RemoveField(
            model_name='thread',
            name='thread_name',
        ),
    ]
