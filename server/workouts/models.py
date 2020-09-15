from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
import random
import datetime

User = get_user_model()

MUSCLE_GROUPS = [
    ('CH', 'Chest'),
    ('BK', 'Back'),
    ('LG', 'Legs'),
    ('SH', 'Shoulders'),
    ('AB', 'Abs'),
    ('BI', 'Biceps'),
    ('TR', 'Triceps')
]


class Exercise(models.Model):
    name = models.CharField(max_length=255, unique=True)
    muscle_group = models.CharField(choices=MUSCLE_GROUPS, max_length=2)
    target_reps = models.IntegerField(default=10)
    is_timed = models.BooleanField(default=False)

    def __str__(self):
        return '%s (%s)' % (self.name, self.get_muscle_group_display())

    class Meta:
        ordering = ('name', )

    @classmethod
    def get_random_exercise_for_muscle_group(cls, muscle_group):
        exercises = cls.objects.filter(muscle_group=muscle_group)
        return random.choice(exercises)


class WorkoutGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created', )

    def is_completed(self):
        for workout in self.workouts.all():
            if not workout.is_completed:
                return False
        return True


@receiver(post_save, sender=WorkoutGroup)
def create_workouts(sender, instance, created, **kwargs):
    from workouts.workout_creator import WorkoutCreator

    if created:
        Workout.objects.filter(group__user=instance.user, is_completed=False).delete()
        WorkoutCreator(instance).create_workouts()


class Workout(models.Model):
    group = models.ForeignKey(WorkoutGroup, on_delete=models.CASCADE, related_name='workouts')
    is_completed = models.BooleanField(default=False)
    date_completed = models.DateField(blank=True, null=True)

    label = models.CharField(max_length=255)
    day_number = models.IntegerField()
    week_number = models.IntegerField()

    def __str__(self):
        return '%s %s: Week %d, Day %d' % (self.group.user, self.label, self.day_number, self.week_number)

    class Meta:
        ordering = ('week_number', 'day_number')

    def save(self, *args, **kwargs):
        if self.is_completed and self.date_completed is None:
            self.date_completed = datetime.date.today()

        return super(Workout, self).save(*args, **kwargs)

    def replace_exercise(self, exercise):
        new_exercise = self.get_random_unused_exercise(exercise.muscle_group)
        for aux_set in self.aux_sets.all():
            if aux_set.actual_reps == 0 and aux_set.exercise.id == exercise.id:
                aux_set.exercise = new_exercise
                aux_set.target_reps = new_exercise.target_reps
                aux_set.save()

    def get_random_unused_exercise(self, muscle_group):
        exercise = Exercise.get_random_exercise_for_muscle_group(muscle_group)
        count = 0

        while self._is_exercise_already_used(exercise):
            exercise = Exercise.get_random_exercise_for_muscle_group(muscle_group)

            count += 1
            if count > 100:
                raise Exception('Not enough %s workouts to random an unused one' % muscle_group)

        return exercise

    def _is_exercise_already_used(self, exercise):
        return self.aux_sets.filter(exercise=exercise).exists() or self.main_sets.filter(exercise=exercise).exists()


class Set(models.Model):
    set_number = models.IntegerField()
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT)
    weight = models.IntegerField(default=0)
    target_reps = models.IntegerField()
    actual_reps = models.IntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ('set_number', )


class MainSet(Set):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='main_sets')
    percent_of_max = models.IntegerField()


class AuxSet(Set):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='aux_sets')


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    plan = models.CharField(choices=[
        ('1', 'Beginner'),
        ('2', 'Standard'),
    ], max_length=2, default='1')


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


class UserMainLift(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='main_lifts')
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT)

    weight_1_rep_max = models.IntegerField()
    increment = models.IntegerField()

    aux_muscle_group1 = models.CharField(choices=MUSCLE_GROUPS, max_length=2, blank=True, null=True)
    aux_muscle_group2 = models.CharField(choices=MUSCLE_GROUPS, max_length=2, blank=True, null=True)

    class Meta:
        unique_together = ('profile', 'exercise')

    def get_day_label(self):
        muscle_groups = [self.exercise.get_muscle_group_display()]
        if self.aux_muscle_group1:
            muscle_groups.append(self.get_aux_muscle_group1_display())
        if self.aux_muscle_group2:
            muscle_groups.append(self.get_aux_muscle_group2_display())
        return '%s Day' % '/'.join(muscle_groups)

