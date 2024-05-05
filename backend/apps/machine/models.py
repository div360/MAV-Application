from django.db import models

class Machine(models.Model):
    name = models.CharField(max_length=100)
    id = models.IntegerField(unique=True)
    history = models.JSONField()

    def __str__(self):
        return self.name
