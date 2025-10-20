from litestar import Litestar, Router
from app.controllers.users import UserController
from app.controllers.health import HealthController

app_router = Router(
    path="/api/v1",
    route_handlers=[
        HealthController,
        UserController
    ]
)

app = Litestar(
    route_handlers=[app_router],
    debug=True
)