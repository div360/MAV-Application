from django.db import models

class Video(models.Model):
    input = models.FileField(upload_to='videos/')
    output = models.FileField(upload_to='videos/')
    description = models.TextField()
    title = models.CharField(max_length=100)
    is_processed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
        