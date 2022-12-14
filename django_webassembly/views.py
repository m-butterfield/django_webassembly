from django.shortcuts import redirect, render


def index(request):
    return render(request, "django_webassembly/index.html")


def favicon(request):
    return redirect("/static/django_webassembly/favicon.ico", permanent=True)
