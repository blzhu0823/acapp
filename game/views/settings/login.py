import imp
from operator import imod
from django.forms import PasswordInput
from django.http import JsonResponse
from django.contrib.auth import authenticate, login


def log_in(request):
    data = request.GET
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse({
            'result': "用户名密码不正确",
        })
    login(request, user)
    return JsonResponse({
        'result': "success",
    })


