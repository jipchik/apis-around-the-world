from litestar import Litestar, Router
from app.controllers.players import PlayerController
from app.controllers.health import HealthController
from app.db import sqlalchemy_plugin

app_router = Router(
    path="/api/v1",
    route_handlers=[
        HealthController,
        PlayerController
    ]
)

app = Litestar(
    route_handlers=[app_router],
    plugins=[sqlalchemy_plugin],
    debug=True
)