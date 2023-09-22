from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from friends.models import FriendList, FriendRequest
from chat.models import Profile
from chat.tasks import mail


# code

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def send_request(request):
    # 
    context = {}
    receiver = User.objects.get(username=request.data['username'])
    sender = request.user
    friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)

    if request.method == "GET":
        if not created: 
            friend_request.toggle_status(True)
        context['message'] = "Request Sent"

    if request.method == "PUT":
        friend_request.cancel()
        context['message'] = "Request Cancelled"

    return Response(context)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def receive_request(request):
    # 
    context = {}
    sender = User.objects.get(username=request.data['username'])
    receiver = request.user
    friend_request, _ = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)

    if request.method == "GET":
        friend_request.accept()
        context['message'] = "Request Accepted"

    elif request.method == "PUT":
        friend_request.decline()
        context['message'] = "Request Declined"

    return Response(context)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unfriend_request(request):
    # 
    context = {}
    friend = User.objects.get(username = request.data['username'])
    my_friend_list = FriendList.objects.get(user = request.user)
    context['message'] = 'ERROR'

    if my_friend_list.is_mutual_friend(friend):
        my_friend_list.unfriend(friend)
        context['message'] = 'Friend Removed'
    
    return Response(context)




