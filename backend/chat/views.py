from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from celery.result import AsyncResult

from .models import Profile
from .serializers import ProfileSerializer
from utils.utils import generateOTP

from chat.tasks import add, mail, clear_otp
from chat.task import threading

from datetime import datetime, timedelta
from django.utils import timezone


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def celery(request):
    
    profile = Profile.objects.get(user = request.user)
    context = {'email': profile.email}

    if request.method == "GET":
        a = request.data.get('a', 0)
        b = request.data.get('b', 0)
        c = request.data.get('c', 0)
        result = add.delay(a, b, c) 
        context["result"] = result.id

    elif request.method == "POST":
        task_id = request.data.get('task_id', '')
        result = AsyncResult(task_id)
        context['result'] = result.result

    elif request.method == "PUT":
        a = request.data.get('a', 0)
        b = request.data.get('b', 0)
        c = request.data.get('c', 0)
        result = threading.delay(a, b, c)
        context["result"] = result.id

    return Response(context)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def email(request):
    
    profile = Profile.objects.get(user = request.user)
    context = {'email': profile.email}
    context['username'] = profile.user.username

    def unverfiy():
        profile.email_verified = False
        profile.save()

    if request.method == 'POST':
        serializer = ProfileSerializer(instance=profile, data=request.data)
        if serializer.is_valid():
            context['email'] = serializer.save().email
            unverfiy()

    elif request.method == 'DELETE':
        profile.email = None
        profile.save()
        context['email'] = profile.email

    return Response(context)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def verify_email(request):

    profile = Profile.objects.get(user = request.user)
    context = {'email': profile.email}

    def del_otp(verified):
        profile.email_otp = None
        profile.email_verified = verified
        profile.save()

    if not profile.email:
        context['message'] = 'no email for this user'

    elif request.method == "GET":
        request.session['attempt'] = 0
        otp = generateOTP()
        profile.email_otp = otp
        profile.otp_time = datetime.now() + timedelta(minutes=5)
        profile.save()
        mail.delay("Verify Otp", f"{otp} valid for {300}s", [profile.email,])
        context['message'] = 'otp sent'
        
    elif request.method == "POST":
        request.session['attempt'] = request.session.get('attempt', 0) + 1
        context['attempt'] = request.session['attempt']

        otp = request.data.get('otp', False)
        condition = context['attempt'] < 4 and otp and profile.otp_time and profile.otp_time > timezone.now() and profile.email_otp == otp

        if condition:
            mail.delay("Confirmed", "Verified", [profile.email,])
            del_otp(True)
            context['message'] = 'otp verified'
        else:
            context['message'] = 'invalid things'

    return Response(context)


@api_view(['GET', 'POST'])
def reset_password(request):

    profile = Profile.objects.get(user = request.user)
    context = {'email': profile.email}

    def del_otp(verified):
        profile.email_otp = None
        profile.email_verified = verified
        profile.save()

    if not profile.email:
        context['message'] = 'no email for this user'

    elif request.method == "GET":
        request.session['attempt_pr'] = 0
        otp = generateOTP()
        profile.email_otp = otp
        profile.otp_time = datetime.now() + timedelta(minutes=5)
        profile.save()
        mail.delay("Reset Otp", f"{otp} valid for {300}s", [profile.email,])
        context['message'] = 'otp sent'
        
    elif request.method == "POST":
        request.session['attempt_pr'] = request.session.get('attempt_pr', 0) + 1
        context['attempt_pr'] = request.session['attempt_pr']

        otp = request.data.get('otp', False)
        new_password = request.data.get('new_password', False)

        print('otp', otp)
        print('otp_time', profile.otp_time, profile.otp_time > timezone.now())
        print('confirm otp', profile.email_otp == otp)

        condition = (
            context['attempt_pr'] < 4 and otp and 
            profile.otp_time and 
            profile.otp_time > timezone.now() and 
            profile.email_otp == otp
        )

        if condition:
            profile.user.set_password(new_password)
            profile.user.save()
            mail.delay("Confirmed", "password reseted", [profile.email,])
            del_otp(True)
            context['message'] = 'otp verified'
        else:
            context['message'] = 'invalid things'

    return Response(context)


def game(request):
    return render(request, "project/index.html")


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
