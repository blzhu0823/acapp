from django.http import HttpResponse

# Create your views here.
def index(request):
    line1 = '<h1 style="text-align: center">it\'s my first web page</h1>'
    line2 = '<img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.gpbctv.com%2Fuploads%2F20210522%2Fzip_1621651691ucC6gM.jpg&refer=http%3A%2F%2Fwww.gpbctv.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653563213&t=8a6890d0e01b74d3730ae5e1a1598577" width=1000>'
    return HttpResponse(line1 + line2)