from django.contrib import admin
from workouts.models import *


class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'muscle_group')
    search_fields = ('name', 'muscle_group')

    class Meta:
        model = Exercise

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutGroup)
admin.site.register(Workout)
admin.site.register(MainSet)
admin.site.register(AuxSet)
admin.site.register(UserMainLift)
admin.site.register(UserProfile)


