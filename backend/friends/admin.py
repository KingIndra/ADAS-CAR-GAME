from django.contrib import admin
from .models import FriendRequest, FriendList, Notification

# Register your models here.
admin.site.register(FriendList)
admin.site.register(FriendRequest)
admin.site.register(Notification)
