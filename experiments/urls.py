from django.urls import path

from pharmapp.experiments import views

app_name = 'experiments'

urlpatterns = [
    path('experiment_add/', views.experiment_add, name='experiment_add'),
    path('experiment_change/', views.experiment_change, name='experiment_change'),
    path('experiment_remove/', views.experiment_remove, name='experiment_remove'),
]
