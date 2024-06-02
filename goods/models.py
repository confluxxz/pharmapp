from django.db import models
from django.urls import reverse


class Categories(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True, verbose_name='URL')

    class Meta:
        db_table = 'category'
        verbose_name = 'Категорию'
        verbose_name_plural = 'Категории предметов лаборатории'

    def __str__(self):
        return self.name


class Items(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True, verbose_name='URL')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    image = models.ImageField(upload_to='store_images', blank=True, null=True, verbose_name='Изображение')

    existence = models.BooleanField(default=False, verbose_name='Наличие')
    quantity = models.IntegerField(default=0, verbose_name='Количество')
    category = models.ForeignKey(to=Categories, on_delete=models.CASCADE, verbose_name='Категория предмета')

    class Meta:
        db_table = 'item'
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'
        ordering = ("id",)

    def __str__(self):
        return f'{self.name} Количество - {self.quantity}'

    def display_id(self):
        return f"{self.id:04}"

    def get_absolute_url(self):
        return reverse("store:item", kwargs={"item_slug":self.slug})