from rest_framework import serializers

from workouts.models import Workout, WorkoutGroup, UserProfile, UserMainLift, Exercise, MainSet, AuxSet


class ExerciseSerializer(serializers.ModelSerializer):
    muscle_group = serializers.CharField(source='get_muscle_group_display')

    class Meta:
        model = Exercise
        fields = '__all__'


class UserMainLiftSerializer(serializers.ModelSerializer):
    exercise_full = ExerciseSerializer(read_only=True, source='exercise')

    class Meta:
        model = UserMainLift
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = '__all__'


class MainSetSerializer(serializers.ModelSerializer):
    exercise_full = ExerciseSerializer(read_only=True, source='exercise')

    class Meta:
        model = MainSet
        fields = '__all__'


class AuxSetSerializer(serializers.ModelSerializer):
    exercise_full = ExerciseSerializer(read_only=True, source='exercise')

    class Meta:
        model = AuxSet
        fields = '__all__'


class WorkoutSerializer(serializers.ModelSerializer):
    main_sets = MainSetSerializer(many=True, read_only=True)
    aux_sets = AuxSetSerializer(many=True, read_only=True)

    class Meta:
        model = Workout
        fields = '__all__'


class WorkoutGroupSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    workouts = WorkoutSerializer(many=True, read_only=True)
    is_completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = WorkoutGroup
        fields = '__all__'
