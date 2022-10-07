from django.contrib import admin

from django_webassembly.polls.models import Choice, Question

admin.site.register(Choice)
admin.site.register(Question)
