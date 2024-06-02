from pharmapp.experiments.models import Experiment


def get_user_experiments(request):
    if request.user.is_authenticated:
        return Experiment.objects.filter(user=request.user)

    if not request.session.session_key:
        request.session.create()
        return Experiment.objects.filter(session_key=request.session.session_key)