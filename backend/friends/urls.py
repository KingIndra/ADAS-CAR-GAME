# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("send_request/", views.send_request, name="send_request"),
    path("receive_request/", views.receive_request, name="receive_request"),
    path("unfriend_request/", views.unfriend_request, name="unfriend_request"),
]
