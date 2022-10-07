import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_webassembly.settings")
os.environ[
    "DJANGO_ALLOW_ASYNC_UNSAFE"
] = "true"  # needed for db migrate, possibly other operations
django.setup()

from django.core.management.commands.migrate import Command as MigrateCommand

MigrateCommand().handle(
    database="default",
    skip_checks=False,
    verbosity=1,
    interactive=False,
    app_label=None,
    migration_name=None,
    noinput=True,
    fake=False,
    fake_initial=False,
    plan=False,
    run_syncdb=False,
    check=False,
    prune=False,
    check_unapplied=False,
)

from django.contrib.auth.models import User

user = User(username="matt", is_staff=True, is_active=True)
user.save()

# hack to bypass auth in admin
from django_webassembly.polls.admin import admin
admin.site.has_permission = lambda r: setattr(r, "user", user) or True
