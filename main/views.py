from django.shortcuts import render



def index(request):


    context = {
        'title': 'Главная',
        'content': 'Главная страница: информационная система кафедры ХФИ',
    }

    return render(request, 'main/index.html', context)


def about(request):
    context = {
        'title': 'О системе',
        'content': 'Информация о системе ',
        'text_on_page': 'Для чего разработана система'
    }

    return render(request, 'main/about.html', context)
