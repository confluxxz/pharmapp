from django.db import models
from pharmapp.goods.models import Items
from pharmapp.users.models import User


class ExperimentQueryset(models.QuerySet):

    def total_quantity(self):
        if self:
            return sum(experiment.quantity for experiment in self)
        return 0


class Experiment(models.Model):

    user = models.ForeignKey(to=User, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Пользователь')
    item = models.ForeignKey(to=Items, on_delete=models.CASCADE, verbose_name='Предмет')
    quantity = models.PositiveIntegerField(default=0, verbose_name='Количество')
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    # date = models.DateTimeField(verbose_name='Дата эксперимента')
    approved = models.BooleanField(default=False, verbose_name='Одобрено')
    session_key = models.CharField(max_length=32, null=True, blank=True)

    class Meta:
        db_table = 'experiment'
        verbose_name = 'Эксперимент'
        verbose_name_plural = 'Эксперименты'

    objects = ExperimentQueryset().as_manager()

    def __str__(self):
        if self.user:
            return f" Эксперимент {self.user.username} | Предмет {self.item.name} | Количество {self.quantity}"
        return f" Эксперимент незарегистрированного пользователя | Предмет {self.item.name} | Количество {self.quantity}"

    def experiment_date(self):
        return f" Дата: {self.created_timestamp}"


