from django.core.mail import send_mail
from chat.models import Profile 

from celery import shared_task 
from django_celery_beat.models import PeriodicTask, IntervalSchedule

from time import sleep
import json


@shared_task
def add(x, y, c):
    sleep(c)
    return x + y


@shared_task
def mail(subject, message, recipients):
    send_mail(subject, message, "KingIndra", recipients, fail_silently = False)
    return f"mail sent to {recipients}"


@shared_task
def clear_otp(id, time):
    sleep(time)
    profile = Profile.objects.get(id=id)
    profile.email_otp = None
    profile.save()
    return f"OTP cleared from profile {profile.user.username}"


@shared_task
def periodic(id):
    print(f'periodic for id:{id}')
    return id


@shared_task
def periodic2(id):
    print(f'this is periodic 2 for id:{id}')
    return id


@shared_task
def periodicF(id):
    return f'FINAL TASK id:{id}'



# schedule, created = IntervalSchedule.objects.get_or_create(
#     every=30,
#     period=IntervalSchedule.SECONDS,
# )

# PeriodicTask.objects.get_or_create(
#     name='HOLAA',
#     task='chat.tasks.periodicF',
#     interval=schedule,
#     args=json.dumps(['hello']),  
# )
