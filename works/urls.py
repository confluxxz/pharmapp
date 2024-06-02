from django.urls import path
from pharmapp.works import views

app_name = 'works'

urlpatterns = [
    path('create-work/', views.create_work, name='create_work')
]