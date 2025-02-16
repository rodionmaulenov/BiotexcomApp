from django.urls import path

from fill_invitation import views

urlpatterns = [
    path('fetch_passport_data', views.FetchPassportText.as_view(), name='fetch_passport_data'),
    path('translate_passport_data', views.TranslatePassportText.as_view(), name='translate_passport_data'),
    path('docx_creation', views.DocxCreation.as_view(), name='docx_creation'),
]
