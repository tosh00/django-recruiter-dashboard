from django import forms
from .models import Person
from django.contrib.auth.models import User

class AddPerson(forms.Form):
    first_name = forms.CharField(label = 'First name', max_length=30)
    last_name = forms.CharField(label = 'Last name', max_length=30)

class AddSkills(forms.Form):
    allc = Person.objects.all()
    l=[]
    for i in allc:
        name = i.first_name+" "+i.last_name
        temp=[i.id, name]
        l.append(temp)
    cand = tuple(l)
    i=1
    l=[]
    while i<11:
        temp=[i, i]
        l.append(temp)
        i+=1
    RANGE=tuple(l)
    l=[]

    
    python = forms.ChoiceField(label = 'python', choices=RANGE, required=True)
    cpp = forms.ChoiceField(label = 'C++', choices=RANGE, required=True)
    javascript = forms.ChoiceField(label = 'javascript', choices=RANGE, required=True)
    english = forms.ChoiceField(label = 'english', choices=RANGE, required=True)
    comunication = forms.ChoiceField(label = 'comunication', choices=RANGE, required=True)
    creativity = forms.ChoiceField(label = 'creativity', choices=RANGE, required=True)
