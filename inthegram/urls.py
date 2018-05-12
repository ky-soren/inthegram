# from django.urls import path
from django.conf.urls import url


from . import views


urlpatterns = [
    url(r"^$", views.IndexView, name="index"),
    url("login", views.LoginView, name="login"),
    url("logout", views.LogoutView, name="logout"),
    url("register", views.RegistrationView, name="register"),
    url(r"^post/$", views.PostListView.as_view()),
    url(r"^post/<pk>$", views.PostDetailView.as_view()),
    url(r"^post/(?P<pk>\d+)/comments$", views.CommentListView.as_view()),
    url(r"^comment/$", views.CommentListView.as_view()),
]
