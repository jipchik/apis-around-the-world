from litestar import Controller, get
from litestar.datastructures import State
from typing import Dict, List


class UserController(Controller):
    path = "/users"
    tags = ["users"]

    @get("/{user_id:str}")
    async def get_user(self, user_id: str) -> Dict[str, str]:
        """Get a specific user by ID"""
        return {"id": user_id, "name": "John Doe", "email": "john@example.com"}