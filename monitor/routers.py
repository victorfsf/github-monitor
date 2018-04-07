from rest_framework.routers import Route, SimpleRouter


class RepositoryNameRouter(SimpleRouter):

    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={'get': 'retrieve'},
            name='{basename}-name-detail',
            detail=True,
            initkwargs={'suffix': 'Detail'}
        ),
    ]
