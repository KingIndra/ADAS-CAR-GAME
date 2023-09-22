# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("celery/", views.celery, name="celery"),

    path("email/", views.email, name="email"),
    path("verify_email/", views.verify_email, name="verify_email"),
    path("reset_password/", views.reset_password, name="reset_password"),

    path("signup/", views.signup, name="signup"),
    path("signin/", views.signin, name="signin"),
    path("signout/", views.signout, name="signout"),

    path("game/", views.game, name="game"),
    path("get_bestbrain/", views.get_bestbrain, name="get_bestbrain"),
]