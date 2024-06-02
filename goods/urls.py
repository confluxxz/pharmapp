from django.urls import path

from pharmapp.goods import views

app_name = 'goods'

urlpatterns = [
    path('search/', views.store, name='search'),
    path('<slug:category_slug>/', views.store, name='index'),
    path('item/<slug:item_slug>/', views.item, name='item'),
]
