# Generated by Django 4.2.5 on 2023-09-16 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_alter_profile_highscore'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='score',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]