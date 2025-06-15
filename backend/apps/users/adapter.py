# apps/users/adapter.py

from allauth.account.adapter import DefaultAccountAdapter


class NoUsernameAccountAdapter(DefaultAccountAdapter):
    def clean_username(self, username):
        return ""
