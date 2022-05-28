from os import access
from random import randint
from django.shortcuts import redirect
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
import requests


def receive_code(request):
    data = request.GET
    code = data.get('code')
    state = data.get('state')
    if not cache.has_key(state):
        return redirect('index')

    cache.delete(state)
    apply_access_token_url = 'https://www.acwing.com/third_party/api/oauth2/access_token/'
    params = {
        'appid': '2236',
        'secret': '0b66bd608c7b4933b6f134aac101ae2a',
        'code': code,
    }

    access_token_response = requests.get(apply_access_token_url, params=params).json()
    get_userinfo_url = 'https://www.acwing.com/third_party/api/meta/identity/getinfo/'
    access_token = access_token_response['access_token']
    openid = access_token_response['openid']
    player = Player.objects.filter(openid=openid).first()
    if player is not None:
        login(request, player.user)
        return redirect('index')
    params = {
        'access_token': access_token,
        'openid': openid,
    }
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['username']
    photo = userinfo_res['photo']
    
    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))
    
    user = User.objects.create_user(username=username)
    player = Player.objects.create(user=user, openid=openid, photo=photo)
    login(request, user)

    return redirect('index')

    
    
