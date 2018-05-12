from django.db import models
# from django.forms import ModelForm

from django.contrib.auth.models import User

# Create your models here.


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.CharField(max_length=200)
    post_date = models.DateTimeField(auto_now_add=True)
    caption = models.TextField()

    def __str__(self):
        return f"{self.post_date} {self.author}"


class Like(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    like_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.like_date} {self.author}"


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    comment_date = models.DateTimeField(auto_now=True)
    comment_text = models.TextField()

    def __str__(self):
        return f"{self.comment_date} {self.author} {self.comment_text}"
