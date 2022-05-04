import re
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player


def register(request):
    data = request.GET
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    password_comfirm = data.get('password_confirm', '').strip()
    if not username or not password:
        return JsonResponse({
            'result': "用户名密码不能为空",
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': "用户名已存在",
        })
    if password != password_comfirm:
        return JsonResponse({
            'result': "两次密码不一致",
        })
    user = User(username=username)
    user.set_password(password)
    user.save()
    Player.objects.create(user=user, photo='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F12%2F20200412003454_eyutv.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654259250&t=6a5b2c2b97e6f265076eed46575f9b55')
    login(request, user)
    return JsonResponse({
        'result': "success",
    })
