from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from app.models.match import Match
    from app.models.team_player import TeamPlayer


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    matches_as_team1: Mapped[List["Match"]] = relationship(
        "Match", foreign_keys="Match.team1_id", back_populates="team1"
    )
    matches_as_team2: Mapped[List["Match"]] = relationship(
        "Match", foreign_keys="Match.team2_id", back_populates="team2"
    )
    team_players: Mapped[List["TeamPlayer"]] = relationship(
        "TeamPlayer", back_populates="team", cascade="all, delete-orphan"
    )