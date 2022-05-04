from django.http import JsonResponse
from django.contrib.auth import logout


def log_out(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "failed",
        })
    logout(request)
    return JsonResponse({
        'result': "success",
    })