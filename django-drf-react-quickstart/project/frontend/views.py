from django.shortcuts import render
import json
import sys
from os import path

sys.path.append( "..")
from django.contrib.auth.models import User
from candidates.models import Person
def index(request):
    data=Person.objects.values('id', 'first_name', 'last_name', 'skills')
    data=json.dumps(list(data))
    recruters=User.objects.filter(groups__name='recruters').values('id', 'first_name', 'last_name')
    recruters=json.dumps(list(recruters))
    return render(request, 'frontend/index.html', {'data': data, 'recruters':recruters})