# Generated by Django 3.0.6 on 2020-08-14 01:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_right_word', models.IntegerField(default=0)),
                ('win', models.BooleanField(default=False)),
            ],
        ),
    ]
