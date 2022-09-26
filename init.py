import os
import sys

import django
from django.contrib.auth.models import User
from django.core.management.commands.migrate import Command as MigrateCommand

sys.path.append(".")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_webassembly.settings")
os.environ[
    "DJANGO_ALLOW_ASYNC_UNSAFE"
] = "true"  # needed for db migrate, possibly other operations
django.setup()

try:
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
        check_unapplied=True,
    )
except SystemExit:
    pass

User(username="matt", is_staff=True, is_active=True).save()
