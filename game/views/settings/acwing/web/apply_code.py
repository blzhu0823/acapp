from django.http import JsonResponse
from urllib.parse import quote
from django.core.cache import cache
from random import randint

def get_state():
    res = ''
    for i in range(8):
        res += str(randint(0, 9))
    
    return res
    


def apply_code(request):
    appid = '2236'
    redirect_uri = quote('https://app2236.acapp.acwing.com.cn/settings/acwing/receive_code')
    scope = 'userinfo'
    state = get_state()
    cache.set(state, None, 3600)
    apply_code_url = 'https://www.acwing.com/third_party/api/oauth2/web/authorize/'
    return JsonResponse({
        'result': 'success',
        'apply_code_url': apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state),
    })
    
    
    
    