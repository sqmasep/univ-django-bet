# Generated by Django 5.0.4 on 2024-05-04 14:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bet', '0005_bet_is_ended_bet_winning_option'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='option',
            name='users',
            field=models.ManyToManyField(related_name='options', through='bet.UserBet', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='bet',
            name='winning_option',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='winning_option', to='bet.option'),
        ),
    ]
