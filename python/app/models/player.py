from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from app.models.match import Match
    from app.models.team_player import TeamPlayer


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    phone_number: Mapped[str] = mapped_column(String, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), name="createdAt"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    matches_as_player1: Mapped[List["Match"]] = relationship(
        "Match", foreign_keys="Match.player1_id", back_populates="player1"
    )
    matches_as_player2: Mapped[List["Match"]] = relationship(
        "Match", foreign_keys="Match.player2_id", back_populates="player2"
    )
    team_players: Mapped[List["TeamPlayer"]] = relationship(
        "TeamPlayer", back_populates="player", cascade="all, delete-orphan"
    )