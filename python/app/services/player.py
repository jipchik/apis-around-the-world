from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions.http_exceptions import HTTPException, NotFoundException

from app.models.player import Player
from app.schemas.player import PlayerCreateSchema, PlayerUpdateSchema


class PlayerService:
    """Service for player-related business logic"""

    @staticmethod
    async def get_player_by_id(db_session: AsyncSession, player_id: int) -> Player:
        """
        Get a player by ID

        Args:
            db_session: Database session
            player_id: Player ID

        Returns:
            Player model instance

        Raises:
            NotFoundException: If player not found
        """
        result = await db_session.execute(select(Player).where(Player.id == player_id))
        player = result.scalar_one_or_none()

        if not player:
            raise NotFoundException(detail=f"Player with ID {player_id} not found")

        return player

    @staticmethod
    async def get_player_by_phone(db_session: AsyncSession, phone_number: str) -> Optional[Player]:
        """
        Get a player by phone number

        Args:
            db_session: Database session
            phone_number: Phone number to search for

        Returns:
            Player model instance or None if not found
        """
        result = await db_session.execute(select(Player).where(Player.phone_number == phone_number))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_players(db_session: AsyncSession, skip: int = 0, limit: int = 100) -> List[Player]:
        """
        Get all players with pagination

        Args:
            db_session: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of Player model instances
        """
        result = await db_session.execute(select(Player).offset(skip).limit(limit))
        return list(result.scalars().all())

    @staticmethod
    async def create_player(db_session: AsyncSession, player_data: PlayerCreateSchema) -> Player:
        """
        Create a new player

        Args:
            db_session: Database session
            player_data: Validated player data

        Returns:
            Created Player model instance

        Raises:
            ConflictException: If player with phone number already exists
        """
        # Check if player with phone number already exists
        existing_player = await PlayerService.get_player_by_phone(db_session, player_data.phone_number)

        if existing_player:
            raise HTTPException(status_code=409, detail="Player already exists")

        # Create new player
        player = Player(
            first_name=player_data.first_name,
            last_name=player_data.last_name,
            phone_number=player_data.phone_number,
        )

        db_session.add(player)
        await db_session.commit()
        await db_session.refresh(player)

        return player

    @staticmethod
    async def update_player(db_session: AsyncSession, player_id: int, player_data: PlayerUpdateSchema) -> Player:
        """
        Update an existing player

        Args:
            db_session: Database session
            player_id: Player ID
            player_data: Validated update data

        Returns:
            Updated Player model instance

        Raises:
            NotFoundException: If player not found
            ConflictException: If phone number already taken by another player
        """
        # Get existing player
        player = await PlayerService.get_player_by_id(db_session, player_id)

        # Check if phone number is being updated and if it's already taken
        if player_data.phone_number and player_data.phone_number != player.phone_number:
            existing_player = await PlayerService.get_player_by_phone(db_session, player_data.phone_number)
            if existing_player and existing_player.id != player_id:
                raise ConflictException(detail=f"Phone number {player_data.phone_number} is already taken by another player")

        # Update fields (only if provided)
        if player_data.first_name is not None:
            player.first_name = player_data.first_name
        if player_data.last_name is not None:
            player.last_name = player_data.last_name
        if player_data.phone_number is not None:
            player.phone_number = player_data.phone_number

        await db_session.commit()
        await db_session.refresh(player)

        return player

    @staticmethod
    async def delete_player(db_session: AsyncSession, player_id: int) -> None:
        """
        Delete a player

        Args:
            db_session: Database session
            player_id: Player ID

        Raises:
            NotFoundException: If player not found
        """
        player = await PlayerService.get_player_by_id(db_session, player_id)

        await db_session.delete(player)
        await db_session.commit()