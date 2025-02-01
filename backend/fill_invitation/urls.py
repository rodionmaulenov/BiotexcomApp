from django.urls import path

from fill_invitation import views

urlpatterns = [
    path('fetch_passport_data', views.FetchPassportText.as_view(), name='fetch_passport_data'),
]
