from __future__ import absolute_import, unicode_literals

from ..celery import app as celery_app

# Django starts so that shared_task will use this app.

__all__ = ("celery_app",)
