from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Profile


class ProfileAPI:

    @database_sync_to_async
    def save(self, user, score):
        profile = Profile.objects.get(user = user)
        profile.score = score
        profile.highscore = max(score, profile.highscore)
        profile.save()
        return profile
    

class ScoresAPIClass:

    def __init__(self) -> None:
        pass

    @database_sync_to_async
    def get(self, user=None):

        all_profiles = Profile.objects.all().order_by('-score')

        for i, p in enumerate(all_profiles, 1):
            if p.user.username == user.username:
                self.rank = i
                break

        profiles = all_profiles[:10]
        self.flag = False

        def mapping(args):
            i, profile = args
            if (user and profile.user.username == user.username): 
                self.flag = True
            return {
                "rank": i,
                "username": profile.user.username, 
                "score": profile.score,
                "highscore": profile.highscore 
            }

        profiles = list(map(mapping, enumerate(profiles, 1)))
        return profiles, self.flag, self.rank
    
ScoresAPI = ScoresAPIClass()


class LeadBoardConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        # 
        self.user = self.scope['user'] 
        # 
        if self.user.is_authenticated:
            self.group_name = "LeadBoard"
            # await ProfileAPI.save(self.user)
            # 
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, data):
        score = data["message"]
        # 
        profile = await ProfileAPI.save(self.user, score)
        players, me_included, my_rank = await ScoresAPI.get(self.user)
        # 
        await self.channel_layer.group_send(self.group_name, {
            "type": "chat.message", 
            "message": {
                "players": players,
                'me_included': me_included,
            },
        })
        await self.send_json({
            'profile': True,
            'rank': my_rank,
            'username': self.user.username,
            'score': profile.score,
            'highscore': profile.highscore,
        })

    async def chat_message(self, event):
        message = event["message"]
        await self.send_json(message)