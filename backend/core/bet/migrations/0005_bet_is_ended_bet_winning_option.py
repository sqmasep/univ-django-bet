# Generated by Django 5.0.4 on 2024-05-04 11:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bet', '0004_alter_bet_signup_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='bet',
            name='is_ended',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='bet',
            name='winning_option',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='winning_option', to='bet.option'),
        ),
    ]
