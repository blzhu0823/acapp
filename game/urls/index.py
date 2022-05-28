from django.urls import path, include
from game.views.index import index

urlpatterns = [
    path('', index, name='index'),
    path('menu/', include('game.urls.menu.index'), name='menu'),
    path('playground/', include('game.urls.playground.index'), name='playground'),
    path('settings/', include('game.urls.settings.index'), name='settings'),
]