from django.urls import path
from .views import get_recipes, create_recipes, recipe_detail
from . import views

urlpatterns = [
    path('recipes/', views.get_recipes, name='get_recipes'),
    path('recipes/create/', create_recipes, name='create_recipes'),
    path('recipes/<int:pk>', recipe_detail, name='recipe_detail')
]