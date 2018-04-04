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
            'id', 'message', 'sha', 'date', 'url', 'author'
        )


class RepositorySerializer(serializers.ModelSerializer):
    commits = CommitSerializer(many=True)

    def create_or_update(self, validated_data, instance=None):
        commits = validated_data.pop('commits', [])
        if not instance:
            instance, _ = Repository.objects.get_or_create(
                **validated_data
            )
        if 'request' in self.context:
            request = self.context.get('request')
            instance.users.add(request.user)
        for commit in commits:
            Commit.objects.get_or_create(repository=instance, **commit)
        return instance

    def update(self, instance, validated_data):
        return self.create_or_update(validated_data, instance=instance)

    def create(self, validated_data):
        return self.create_or_update(validated_data)

    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'owner', 'commits'
        )
