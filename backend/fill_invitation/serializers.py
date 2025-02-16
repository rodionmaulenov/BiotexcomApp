from rest_framework import serializers

from fill_invitation.services import is_foreign_passport


class PassportImageSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField()
    )

    @staticmethod
    def validate_images(values):
        new_values = []
        for value in values:
            try:
                passport = is_foreign_passport(value)
                if passport:
                    new_values.append(value)
            except TypeError as e:
                raise serializers.ValidationError(str(e))
            except Exception as e:
                raise serializers.ValidationError(str(e))
        if len(new_values) == 0:
            raise serializers.ValidationError('Upload the passort image')
        return new_values

