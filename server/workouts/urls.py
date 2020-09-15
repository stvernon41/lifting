from django.conf.urls import url
from rest_framework import routers

from workouts.views import WorkoutView, WorkoutGroupViewSet, UserProfileViewSet, UserMainLiftViewSet, ExerciseViewSet, \
    WorkoutViewSet, MainSetViewSet, AuxSetViewSet, ReplaceExerciseViewSet

router = routers.SimpleRouter()
router.register(r'user_profile', UserProfileViewSet)
router.register(r'user_main_lift', UserMainLiftViewSet)
router.register(r'workout_group', WorkoutGroupViewSet)
router.register(r'workout', WorkoutViewSet)
router.register(r'exercise', ExerciseViewSet)
router.register(r'main_set', MainSetViewSet)
router.register(r'aux_set', AuxSetViewSet)
router.register(r'replace_exercise', ReplaceExerciseViewSet, basename='replace_exercise')


urlpatterns = [
    url(r'^$', WorkoutView.as_view(), name='index'),
]
