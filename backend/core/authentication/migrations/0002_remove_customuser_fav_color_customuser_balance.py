# Generated by Django 5.0.4 on 2024-04-26 13:37

import django.core.validators
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='fav_color',
        ),
        migrations.AddField(
            model_name='customuser',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))]),
        ),
    ]