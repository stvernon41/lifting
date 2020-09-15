from django.views.generic import TemplateView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import ParseError, NotFound
from rest_framework.response import Response

from workouts.models import WorkoutGroup, UserProfile, UserMainLift, Exercise, Workout, MainSet, AuxSet
from workouts.serializers import WorkoutGroupSerializer, UserProfileSerializer, UserMainLiftSerializer, \
    ExerciseSerializer, WorkoutSerializer, MainSetSerializer, AuxSetSerializer


class WorkoutView(TemplateView):
    template_name = 'index.html'


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    http_method_names = ['get']


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class UserMainLiftViewSet(viewsets.ModelViewSet):
    queryset = UserMainLift.objects.all()
    serializer_class = UserMainLiftSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        return self.queryset.filter(profile__user=self.request.user)


class WorkoutGroupViewSet(viewsets.ModelViewSet):
    queryset = WorkoutGroup.objects.all()
    serializer_class = WorkoutGroupSerializer
    http_method_names = ['get', 'post']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    http_method_names = ['get', 'patch']
    filter_backends = [DjangoFilterBackend]
    filter_fields = ("is_completed",)

    def get_queryset(self):
        return self.queryset.filter(group__user=self.request.user)


class MainSetViewSet(viewsets.ModelViewSet):
    queryset = MainSet.objects.all()
    serializer_class = MainSetSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        return self.queryset.filter(workout__group__user=self.request.user)


class AuxSetViewSet(viewsets.ModelViewSet):
    queryset = AuxSet.objects.all()
    serializer_class = AuxSetSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        return self.queryset.filter(workout__group__user=self.request.user)


class ReplaceExerciseViewSet(viewsets.ViewSet):
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        if 'workout' not in request.data:
            raise ParseError('Missing workout field')
        if 'exercise' not in request.data:
            raise ParseError('Missing exercise field')

        try:
            workout = Workout.objects.get(id=request.data['workout'], group__user=request.user)
        except Workout.DoesNotExist:
            raise NotFound()

        try:
            exercise = Exercise.objects.get(id=request.data['exercise'])
        except Workout.DoesNotExist:
            raise NotFound()

        workout.replace_exercise(exercise)
        return Response(WorkoutSerializer(workout).data)
