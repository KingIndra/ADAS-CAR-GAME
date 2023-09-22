from django.contrib import admin
from .models import FriendRequest, FriendList

# Register your models here.
admin.site.register(FriendList)
admin.site.register(FriendRequest)
