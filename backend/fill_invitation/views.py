from rest_framework.response import Response
from rest_framework.views import APIView

from fill_invitation.services import retrieve_from_image


class FetchPassportText(APIView):

    @staticmethod
    def post(request, *args, **kwargs):
        if 'files' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=400)
        passport_results = retrieve_from_image(request)
        return Response({
            "status": "success",
            "message": "Passport data extraction complete.",
            "passports": passport_results
        }, status=200)