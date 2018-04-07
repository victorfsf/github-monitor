from rest_framework.routers import Route, SimpleRouter


class RepositoryCommitsRouter(SimpleRouter):

    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={'get': 'list'},
            name='{basename}-repo-list',
            detail=True,
            initkwargs={'suffix': 'List'}
        ),
    ]
