from django.urls import path

from django_webassembly.polls import views

urlpatterns = [
    path("", views.index, name="index"),
]
