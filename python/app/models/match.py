from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, func, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from app.models.player import Player
    from app.models.team import Team
    from app.models.set import Set


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String)
    match_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    final_score: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    winner_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    duration_in_ms: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True
    )
    status: Mapped[str] = mapped_column(
        String, server_default="INCOMPLETE"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    player1_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("python.players.id"), nullable=True
    )
    player2_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("python.players.id"), nullable=True
    )
    team1_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("python.teams.id"), nullable=True
    )
    team2_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("python.teams.id"), nullable=True
    )

    # Relationships
    player1: Mapped[Optional["Player"]] = relationship(
        "Player", foreign_keys=[player1_id], back_populates="matches_as_player1"
    )
    player2: Mapped[Optional["Player"]] = relationship(
        "Player", foreign_keys=[player2_id], back_populates="matches_as_player2"
    )
    team1: Mapped[Optional["Team"]] = relationship(
        "Team", foreign_keys=[team1_id], back_populates="matches_as_team1"
    )
    team2: Mapped[Optional["Team"]] = relationship(
        "Team", foreign_keys=[team2_id], back_populates="matches_as_team2"
    )
    sets: Mapped[List["Set"]] = relationship(
        "Set", back_populates="match", cascade="all, delete-orphan"
    )