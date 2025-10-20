from litestar import Controller, get
from litestar.datastructures import State
from typing import Dict, List


class HealthController(Controller):
    path = "/health"
    tags = ["health"]

    @get("/")
    async def health_check(self) -> dict[str, str]:
        return {"status": 200, "message": "Healthy."}