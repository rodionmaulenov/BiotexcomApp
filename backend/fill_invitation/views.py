from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from fill_invitation.serializers import PassportImageSerializer
from fill_invitation.services import retrieve_from_image, translate_passport_list, doc, merge_passport_data


class FetchPassportText(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = PassportImageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            images = serializer.validated_data['images']

            passport_results = retrieve_from_image(images)
            return Response(
                {
                    "status": "success",
                    "message": "Passport data extraction complete.",
                    "passports": passport_results,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TranslatePassportText(APIView):
    
    def post(self, request):
        passport_list = request.data
        if not isinstance(passport_list, list):
            return Response({"error": "Invalid data format. Expected a list of dictionaries."},
                             status=status.HTTP_400_BAD_REQUEST)

        try:
            translated_passports = translate_passport_list(passport_list)
            return Response(translated_passports, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class DocxCreation(APIView):
    
    def post(self, request):
        passport_data = request.data.copy()
        list_data = merge_passport_data(passport_data['data'], passport_data['dataUkr'])
        doc(list_data)
        return Response({})
 