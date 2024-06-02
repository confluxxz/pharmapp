from django.contrib import admin
from pharmapp.experiments.models import Experiment


class ExperimentTabularAdmin(admin.TabularInline):
    model = Experiment
    fields = ["item", "quantity", "created_timestamp"]
    search_fields = ["item", "quantity", "created_timestamp"]
    readonly_fields = ("created_timestamp",)
    extra = 1


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'quantity', 'created_timestamp']
    list_filter = ["created_timestamp", "user", "item__name"]

    def item_display(self, obj):
        return str(obj.item.name)

