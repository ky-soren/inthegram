from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Post, Comment

from .serializers import CommentSerializer, PostSerializer

import hashlib
import boto3
import pdb

# Create your views here.


# displays all the posts
def IndexView(request):
    if not request.user.is_authenticated:
        return render(request, "inthegram/login.html")
    context = {"user": request.user}
    return render(request, "inthegram/index.html", context)


# creates a user
def RegistrationView(request):
    if request.method == 'GET':
        return render(request, "inthegram/register.html", {"message": None})
    else:
        try:
            username = request.POST["username"]
            password = request.POST["password"]
            User.objects.create_user(username=username, password=password)
            return render(request, "inthegram/login.html",
                          {"message": "Account created! Please login."})
        except IntegrityError:
            return render(request, "inthegram/register.html",
                          {"message": "Username is already taken"})


# logs the user in
def LoginView(request):
    if request.method == 'GET':
        return render(request, "inthegram/login.html", {"message": None})

    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "inthegram/login.html",
                      {"message": "Invalid login, please try again."})


# logs the user out
def LogoutView(request):
    logout(request)
    return render(request, "inthegram/login.html",
                  {"message": "Successfully logged out."})

# retrieves all the posts
class PostListView(APIView):

    def post(self, request):
        s3 = boto3.resource('s3')
        # bucket = s3.Bucket('your-s3-bucket-here')
        image = request.data['image-file'].file
        data = {}
        # hashes the file object to prevent overwriting
        image_name = hashlib.sha256(image.getbuffer().tobytes()).hexdigest() + '.jpg'
        # url = f"https://s3-us-west-1.amazonaws.com/your-server-url-here/{image_name}"
        data['caption'] = request.data['caption']
        data['image'] = url
        post = PostSerializer(data=data, context={'image': url})

        bucket.put_object(Key=image_name, Body=image)
        if post.is_valid():
            post.save(author=request.user)
            return Response(post.data)
        return Response(post.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


# retrieves a single post
class PostDetailView(APIView):

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    def patch(self, request, pk):
        # post = get_object_or_404(Post, pk=pk)
        post = PostSerializer(request.data, partial=True)
        if post.is_valid():
            post.save()
            return Response(post.data)
        return Response(post.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# retrieves all the comments given a post ID
class CommentListView(APIView):

    def get(self, request, pk):
        comments = Comment.objects.filter(post=pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        comment = CommentSerializer(data=request.data)
        if comment.is_valid():
            comment.save(author=request.user)
            return Response(comment.data)
        return Response(comment.errors, status=status.HTTP_400_BAD_REQUEST)
