from django.db import models
from django.contrib.auth.models import User

from datetime import datetime, timedelta
from django.db.models.functions import Now

# code

# 
class FriendList(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='user')
    friends = models.ManyToManyField(User, blank=True, related_name='friends')

    def __str__(self) -> str:
        return self.user.username

    def add_friend(self, account):
        if not account in self.friends.all():
            self.friends.add(account)
            self.save()

    def remove_friend(self, account):
        if account in self.friends.all():
            self.friends.remove(account)
            self.save()

    def unfriend(self, removee):
        self.remove_friend(removee)
        friends_list = FriendList.objects.get(user=removee)
        friends_list.remove_friend(self.user)
    
    def is_mutual_friend(self, friend):
        if friend in self.friends.all():
            return True
        return False


# 
class FriendRequest(models.Model):

    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='reciver')
    is_active = models.BooleanField(null=True, blank=True, default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.sender.username} to {self.receiver.username}'
    
    def accept(self):
        receiver_friend_list = FriendList.objects.get(user=self.receiver)
        if receiver_friend_list:
            receiver_friend_list.add_friend(self.sender)
            sender_friend_list = FriendList.objects.get(user=self.sender)
            if sender_friend_list:
                sender_friend_list.add_friend(self.receiver)
                self.is_active = False
                self.save()

    def decline(self):
        self.is_active = False
        self.save()

    def cancel(self):
        self.is_active = False
        self.save()

    def toggle_status(self, flag):
        self.is_active = flag
        self.save()


# 
class Notification(models.Model):

    receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='received_by')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sendt_by')
    message = models.TextField(null=True, blank=True)
    seen = models.BooleanField(null=True, blank=True, default=False)
    category = models.CharField(max_length=100, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_or_create(receiver, sender, message, category):
        # 
        receiver = User.objects.get(username=receiver)
        sender = User.objects.get(username=sender)
        # 
        return Notification.objects.get_or_create(
            receiver=receiver, sender=sender, message=message, category=category
        )
    
    @staticmethod
    def clear_notifications():
        Notification.objects.filter(
            seen = True,
            timestamp__lt = Now() - timedelta(days=1)
        ).delete()

    def see(self):
        self.seen = True
        self.save()

    def __str__(self) -> str:
        return f'{self.sender.username} notifying {self.receiver.username}'
    