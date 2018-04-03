from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

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
            'id', 'message', 'sha', 'date', 'url', 'author'
        )


class RepositorySerializer(serializers.ModelSerializer):
    commits = CommitSerializer(many=True)

    def create(self, validated_data):
        user = CurrentUserDefault()
        commits = validated_data.pop('commits', [])
        repo, _ = Repository.objects.get_or_create(**validated_data)
        if 'request' in self.context:
            user.set_context(self)
            request = self.context.get('request')
            repo.users.add(request.user)
        for commit in commits:
            Commit.objects.get_or_create(**commit)
        return repo

    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'owner', 'commits'
        )
