# Generated by Django 2.0.3 on 2018-04-28 23:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inthegram', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='image',
            new_name='post',
        ),
    ]