from django.http import HttpResponseRedirect
from django.shortcuts import render
import json
from .models import Person
from django.contrib.auth import logout
from .forms import AddPerson, AddSkills
from django.contrib.auth.models import User

def get_name(request):
    if request.method == 'POST':
        form = AddPerson(request.POST)
        if form.is_valid():
            temp = Person()
            temp.first_name=request.POST.get('first_name')
            temp.last_name=request.POST.get('last_name')
            temp.save()
            return HttpResponseRedirect('/candidates')
    else:
        form = AddPerson()
        data=Person.objects.values('id', 'first_name', 'last_name', 'skills')
        data=json.dumps(list(data))
    return render(request, 'addperson/index.html', {'form':form, 'data':data})

def logout_user(request):
        if request.method == 'GET':
            logout(request)
        return HttpResponseRedirect('/candidates')

def redirect(request):
        if request.method == 'GET':
            return HttpResponseRedirect('/candidates')

def get_skills(request, pk):
    if request.method == 'POST':
        form = AddSkills(request.POST)
        if form.is_valid():
            person=Person.objects.get(id=pk)
            print(person.skills)
            skills=person.skills
            if skills!='':
                skills=json.loads(skills)
            else:
                skills={}
            temp = {}
            for i in form.fields:
                if i!='person' and i!='recruter':
                    temp.update({i: request.POST.get(i)})
            recname=request.user.id
            skills[recname]=temp
            person.skills=json.dumps(skills)
            person.save()
            return HttpResponseRedirect('/candidates')
    else:
        form = AddSkills()
        person=Person.objects.get(id=pk)
        name = person.first_name+" "+person.last_name
    return render(request, 'addskills/index.html', {'form':form, 'person':name})

def delete_person(request, pk):
    if request.method == 'GET':
        person = Person.objects.get(id=pk)
        print(person)
        person.delete()
        print(person)
    return HttpResponseRedirect('/candidates')
