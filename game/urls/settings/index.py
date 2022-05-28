from django.urls import path, include
from game.views.settings.get_info import get_info
from game.views.settings.login import log_in
from game.views.settings.logout import log_out
from game.views.settings.register import register

urlpatterns = [
    path('get_info/', get_info, name='settings_get_info'),
    path('login/', log_in, name='settings_login'),
    path('logout/', log_out, name='settings_logout'),
    path('register/', register, name='settings_register'),
    path('acwing/', include('game.urls.settings.acwing.index'), name='settings_acwing'),
]