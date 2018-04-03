from rest_framework import serializers

from monitor.models import Commit, Repository


class OrderByDateSerializer(serializers.ListSerializer):

    def to_representation(self, data):
        data = data.order_by('-date')
        return super().to_representation(data)


class CommitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commit
        list_serializer_class = OrderByDateSerializer
        fields = (
            'id', 'message', 'sha', 'date', 'html_url', 'author'
        )


class RepositorySerializer(serializers.ModelSerializer):
    commits = CommitSerializer(many=True)

    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'owner', 'commits'
        )
