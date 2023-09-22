
from rest_framework import serializers
from chat import models


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ['user', 'highscore', 'score', 'email']
