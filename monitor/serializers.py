from rest_framework import serializers

from monitor.models import Author, Commit, Repository
from monitor.tasks import create_github_hook
from monitor.utils import get_author


class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = (
            'id', 'github_id', 'name', 'login', 'email'
        )


class CommitSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    repository = serializers.StringRelatedField()

    class Meta:
        model = Commit
        fields = (
            'id', 'message', 'sha', 'date', 'url', 'branch',
            'author', 'repository',
        )


class RepositorySerializer(serializers.ModelSerializer):
    commits = CommitSerializer(many=True)

    def get_user(self):
        if 'request' in self.context:
            request = self.context.get('request')
            user = request.user
            return user if user.is_authenticated() else None
        return None

    def create_or_update(self, validated_data, instance=None):
        commits = validated_data.pop('commits', [])
        if not instance:
            instance, _ = Repository.objects.get_or_create(
                **validated_data
            )
        user = self.get_user()
        if user:
            instance.users.add(user)
        for commit in commits:
            commit.pop('id', None)
            author = get_author(commit.pop('author', None))
            if author:
                commit.update({
                    'author': author
                })
                commit, _ = Commit.objects.update_or_create(
                    sha=commit['sha'],
                    repository=instance,
                    defaults=commit
                )
        return instance

    def update(self, instance, validated_data):
        return self.create_or_update(validated_data, instance=instance)

    def create(self, validated_data):
        instance = self.create_or_update(validated_data)
        user = self.get_user()
        if user:
            create_github_hook.delay(
                user.github.access_token, str(instance)
            )
        return instance

    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'owner', 'commits'
        )
