from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField(blank=True, null=True, default=0)
    highscore = models.IntegerField(blank=True, null=True, default=0)
    bestbrain = models.TextField(blank=True, null=True, default='')
    email = models.EmailField(blank=True, null=True, unique=True)