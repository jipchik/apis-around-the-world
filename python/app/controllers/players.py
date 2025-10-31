from litestar import Controller, get, post, put, delete
from litestar.params import Body
from litestar.di import Provide
from litestar.status_codes import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.player import PlayerCreateSchema, PlayerResponseSchema, PlayerUpdateSchema
from app.services.player import PlayerService


class PlayerController(Controller):
    path = "/players"
    tags = ["players"]

    @get("/")
    async def list_players(self, db_session: AsyncSession, skip: int = 0, limit: int = 100) -> List[PlayerResponseSchema]:
        """
        Get all players with optional pagination

        Args:
            db_session: Database session (injected)
            skip: Number of records to skip (default: 0)
            limit: Maximum records to return (default: 100)

        Returns:
            List of players
        """
        players = await PlayerService.get_all_players(db_session, skip=skip, limit=limit)
        return [PlayerResponseSchema.model_validate(player) for player in players]

    @get("/{player_id:int}")
    async def get_player(self, player_id: int, db_session: AsyncSession) -> PlayerResponseSchema:
        """
        Get a specific player by ID

        Args:
            player_id: Player ID
            db_session: Database session (injected)

        Returns:
            Player details

        Raises:
            NotFoundException: If player not found
        """
        player = await PlayerService.get_player_by_id(db_session, player_id)
        return PlayerResponseSchema.model_validate(player)

    @post("/", status_code=HTTP_201_CREATED)
    async def create_player(self, data: PlayerCreateSchema, db_session: AsyncSession) -> PlayerResponseSchema:
        """
        Create a new player

        Args:
            data: Player creation data (validated by Pydantic)
            db_session: Database session (injected)

        Returns:
            Created player details

        Raises:
            ConflictException: If phone number already exists
            ValidationException: If data validation fails
        """
        player = await PlayerService.create_player(db_session, data)
        return PlayerResponseSchema.model_validate(player)

    @put("/{player_id:int}")
    async def update_player(self, player_id: int, data: PlayerUpdateSchema, db_session: AsyncSession) -> PlayerResponseSchema:
        """
        Update an existing player

        Args:
            player_id: Player ID
            data: Player update data (validated by Pydantic)
            db_session: Database session (injected)

        Returns:
            Updated player details

        Raises:
            NotFoundException: If player not found
            ConflictException: If phone number already taken
            ValidationException: If data validation fails
        """
        player = await PlayerService.update_player(db_session, player_id, data)
        return PlayerResponseSchema.model_validate(player)

    @delete("/{player_id:int}", status_code=HTTP_204_NO_CONTENT)
    async def delete_player(self, player_id: int, db_session: AsyncSession) -> None:
        """
        Delete a player

        Args:
            player_id: Player ID
            db_session: Database session (injected)

        Raises:
            NotFoundException: If player not found
        """
        await PlayerService.delete_player(db_session, player_id)