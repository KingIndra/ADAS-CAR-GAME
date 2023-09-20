from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Profile


@login_required
def cors(request):
    context = {}
    context['username'] = request.user.username
    return JsonResponse(context)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cors_rest(request):
    context = {}
    context['username'] = request.user.username
    return Response(context)



def game(request):
    context = {
        'list': []
    }
    return render(request, "project/index.html", context)


def signup(request):
    context = {}
    if request.user.is_authenticated:
        return redirect("game")
    
    signup_form = UserCreationForm()
    if request.method == "POST":
        signup_form = UserCreationForm(request.POST)

        if signup_form.is_valid():
            user = signup_form.save()
            login(request, user)
            profile = Profile.objects.create(user = user)
            profile.save()
            context['user'] = user
            return redirect('game')
        else:
            signup_form = UserCreationForm(request.POST)

    context["signup_form"] = signup_form
    return render(request, 'user/signup.html', context)


def signin(request):

    if request.user.is_authenticated:
        return redirect('game')

    if request.method == "POST":
        signin_form = AuthenticationForm(request, data=request.POST)
        if signin_form.is_valid():
            user = signin_form.get_user()
            login(request, user)
            return redirect('game')
    else:
        signin_form = AuthenticationForm()
            
    context = {
        "signin_form": signin_form
    }
    return render(request, 'user/signin.html', context)


@login_required
def signout(request):
    logout(request)
    return redirect("game")


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def get_bestbrain(request):
    # 
    context = {}
    profile = Profile.objects.get(user = request.user)

    if request.method == "POST": 
        bestbrain = request.data.get('bestbrain', '')
        profile.bestbrain = bestbrain
        profile.save()
    
    if request.method == "DELETE":
        profile.bestbrain = ""
        profile.save()

    context['bestbrain'] = profile.bestbrain
    return Response(context)


def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})