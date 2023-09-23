from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from friends.models import FriendRequest, FriendList


# code

class NotificationConsumer(AsyncJsonWebsocketConsumer):

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

    async def receive_json(self, data):
        await self.channel_layer.group_send(self.group_name, {
            'type': data['type'], 
            'payload': data['payload'],
        })

    async def send_request(self, event):
        payload = event['payload']
        await self.channel_layer.group_send(f"Notifications_{payload['username']}", {
            'type': "proceed_" + event['type'],
            'payload': payload
        })
    async def proceed_send_request(self, event):
        payload = event['payload']
        await self.send_json({
            'payload': payload
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)