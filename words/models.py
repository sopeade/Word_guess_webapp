from django.db import models

# Create your models here.


class status(models.Model):
    num_right_word = models.IntegerField(default=0)
    win = models.BooleanField(default=False)
    lose = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.num_right_word}, {self.win}"


class word_name(models.Model):
    searched_word = models.CharField(max_length=20, null=False, blank=False)

    def __str__(self):
        return f"{self.word_name}"