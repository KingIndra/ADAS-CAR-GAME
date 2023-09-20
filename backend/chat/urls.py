# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("cors/", views.cors, name="cors"),
    path("cors_rest/", views.cors_rest, name="cors_rest"),

    path("signup/", views.signup, name="signup"),
    path("signin/", views.signin, name="signin"),
    path("signout/", views.signout, name="signout"),

    path("game/", views.game, name="game"),
    path("get_bestbrain/", views.get_bestbrain, name="get_bestbrain"),

    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
]