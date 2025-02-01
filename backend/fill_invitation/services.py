from rest_framework.response import Response

from openai import OpenAI
from typing import Generator
from dotenv.main import load_dotenv

import base64
import json
import os


load_dotenv()


def get_base64_image(request) -> Generator[str, None, None]:
    """Yields base64-encoded images from uploaded files in the request."""

    uploaded_files = request.FILES.getlist('files')

    for uploaded_file in uploaded_files:
        try:
            base64_image = base64.b64encode(uploaded_file.read()).decode('utf-8')
            yield base64_image
        except Exception as e:
            raise ValueError(f"Failed to encode image: {str(e)}")


def retrieve_from_image(request):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    passport_results = []

    for base64_image in get_base64_image(request):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "You are a passport OCR assistant. Extract only the following details from the image and return the output strictly as a JSON object with the following structure:"
                                    "\n{\n"
                                    "  \"surname\": \"\",\n"
                                    "  \"name\": \"\",\n"
                                    "  \"father_name\": \"\",\n"
                                    "  \"date_of_issue\": \"YYYY-MM-DD\",\n"
                                    "  \"passport_number\": \"\",\n"
                                    "  \"date_of_birth\": \"YYYY-MM-DD\"\n"
                                    "}"
                        }
                    ],
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract passport details from this image:"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }
            ],
            max_tokens=300
        )
        gpt_response = response.choices[0].message.content.strip()

        if not gpt_response:
            return Response({"error": "Empty response from OpenAI"}, status=500)

        if gpt_response.startswith("```json") and gpt_response.endswith("```"):
            gpt_response = gpt_response[7:-3].strip()

        try:
            passport_data = json.loads(gpt_response)
            passport_results.append(passport_data)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format received", "raw_response": gpt_response}, status=500)

    return passport_results