from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from friends.models import FriendRequest, FriendList, Notification


# code
class NotifyDB:
    '''friend request API'''
    def __init__(self):
        pass

    @database_sync_to_async
    def create(self, receiver, sender, message, category):
        notification, created = Notification.get_or_create(
            receiver=receiver, sender=sender, message=message, category=category
        )
        return notification

notify = NotifyDB()


class NotificationConsumer(AsyncJsonWebsocketConsumer):

    # connect
    async def connect(self):
        # 
        self.user = self.scope['user']
        # 
        if self.user.is_authenticated:
            self.group_name = f"Notifications_{self.user.username}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    # receive json
    async def receive_json(self, data):
        await self.channel_layer.group_send(self.group_name, {
            'type': data['category'], 
            'payload': data['payload'],
        })

    # sending request
    async def send_request(self, data):
        category = data['type']
        payload = data['payload']
        # 
        sender = self.user.username
        receiver = payload['receiver']
        message = payload['message']
        await notify.create(receiver, sender, message, category=category)
        # 
        await self.channel_layer.group_send(f"Notifications_{receiver}", {
            'type': "proceed_" + category,
            'payload': {
                'category': category,
                'sender': sender,
                'message': message
            }
        })

    async def proceed_send_request(self, data):
        payload = data['payload']
        await self.send_json(payload)

    # receiving request
    async def receive_request(self, data):
        category = data['type']
        payload = data['payload']
        # 
        sender = self.user.username
        accepted = payload['accepted']
        receiver = payload['receiver']
        message = payload['message']
        await notify.create(receiver, sender, message, category=category)
        # 
        await self.channel_layer.group_send(f"Notifications_{receiver}", {
            'type': "proceed_" + category,
            'payload': {
                'category': category,
                'sender': sender,
                'message': message,
                'accepted': accepted
            }
        })

    async def proceed_receive_request(self, data):
        payload = data['payload']
        await self.send_json(payload)

    # disconnect
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
