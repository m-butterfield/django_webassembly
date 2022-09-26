from django.contrib import admin
from django.contrib.auth.models import User

from django_webassembly.polls.models import Choice, Question

# hack to bypass auth in admin
anonymous_user = User.objects.first()
admin.site.has_permission = lambda r: setattr(r, "user", anonymous_user) or True

admin.site.register(Choice)
admin.site.register(Question)
