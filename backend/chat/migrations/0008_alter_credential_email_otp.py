# Generated by Django 4.2.5 on 2023-09-20 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_rename_credentials_credential'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credential',
            name='email_otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
