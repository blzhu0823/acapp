from django.http import JsonResponse
from game.models.player.player import Player


def get_info_acapp(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo,
    })

def get_info_web(request):
    if(not request.user.is_authenticated):
        return JsonResponse({
            'result': "fail",
            'error': "not logged in",
        })
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo,
    })


def get_info(request):
    platform = request.GET.get('platform')
    if platform == 'acapp':
        return get_info_acapp(request)
    elif platform == 'web':
        return get_info_web(request)