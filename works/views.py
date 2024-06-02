from django.shortcuts import render


def create_work(request):
    return render(request, "works/create_work.html")
