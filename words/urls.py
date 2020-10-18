from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("search", views.search, name="search"),
    path("guess", views.guess, name="guess"),
    path("hint", views.hint, name="hint"),
    path("guess_letter", views.guess_letter, name="guess_letter"),
    path("save", views.save, name="save"),
    path("reset", views.reset, name="reset")
]
