from workouts.models import UserProfile, Workout, MainSet, Exercise, AuxSet
import random


class WorkoutCreator(object):

    def __init__(self, workout_group):
        self._workout_group = workout_group
        self._profile = UserProfile.objects.get(user=workout_group.user)
        self._curr_aux_set_num = 1

    def create_workouts(self):
        if self._profile.plan == '1':
            self._generate_week(1, sets=[(.65, 5), (.75, 5), (.85, 5)])
        elif self._profile.plan == '2':
            self._generate_week(1, sets=[(.65, 5), (.75, 5), (.85, 5)])
            self._generate_week(2, sets=[(.7, 3), (.8, 3), (.9, 3)])
            self._generate_week(3, sets=[(.75, 5), (.85, 3), (.95, 1)])
            self._generate_week(4, sets=[(.5, 5), (.6, 5), (.7, 5)])
        else:
            raise NotImplementedError

    def _generate_week(self, week_num, sets):
        for i, main_lift in enumerate(self._profile.main_lifts.all()):
            label = main_lift.get_day_label()
            day_num = i + 1
            workout = Workout.objects.create(
                group=self._workout_group,
                week_number=week_num,
                day_number=day_num,
                label=label
            )

            self._add_main_sets(workout, main_lift, sets)
            self._add_aux_sets(workout, main_lift)

    def _add_main_sets(self, workout, main_lift, sets):
        for i, (max_percent, reps) in enumerate(sets):
            set_num = i + 1
            weight = main_lift.weight_1_rep_max * max_percent
            weight -= weight % 5

            MainSet.objects.create(
                workout=workout,
                percent_of_max=max_percent * 100,
                set_number=set_num,
                exercise=main_lift.exercise,
                weight=weight,
                target_reps=reps
            )

    def _add_aux_sets(self, workout, main_lift):
        self._curr_aux_set_num = 1

        for i in range(3):
            if i != 0:
                self._add_random_aux_sets(workout, main_lift.exercise.muscle_group)

            if main_lift.aux_muscle_group1:
                self._add_random_aux_sets(workout, main_lift.aux_muscle_group1)

            if main_lift.aux_muscle_group2:
                self._add_random_aux_sets(workout, main_lift.aux_muscle_group2)

    def _add_random_aux_sets(self, workout, muscle_group):
        exercise = workout.get_random_unused_exercise(muscle_group)
        number_of_sets = random.choice([3, 4, 5])

        for _ in range(number_of_sets):
            AuxSet.objects.create(
                workout=workout,
                set_number=self._curr_aux_set_num,
                exercise=exercise,
                target_reps=exercise.target_reps
            )
            self._curr_aux_set_num += 1
