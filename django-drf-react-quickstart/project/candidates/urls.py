
from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from django.contrib.auth import views as auth_views
from candidates import views
from django.conf.urls import url

urlpatterns = [
    path('candidates/', views.get_name),
    path('candidates/skills/<int:pk>/', views.get_skills),
    path('candidates/delete/<int:pk>/', views.delete_person),
    path('', include('django.contrib.auth.urls')),
    path('logoutuser', views.logout_user),
    path('accounts/profile', views.redirect),
    path('accounts/profile/', views.redirect),
]



urlpatterns = format_suffix_patterns(urlpatterns)
