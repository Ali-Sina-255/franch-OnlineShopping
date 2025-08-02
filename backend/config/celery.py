import os

from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

# Create the Celery app instance
app = Celery("config")

# Configure Celery to use Django settings with CELERY_ prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Automatically discover tasks in all registered Django app configs
app.autodiscover_tasks()

# 🚨 Manually import any task modules that Celery might miss
# This helps with apps not following default structure
try:
    import apps.product.tasks
except ImportError:
    pass  # Log or raise if needed


# Optional: Debugging task to confirm Celery is working
@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f"[DEBUG] Request received: {self.request!r}")
