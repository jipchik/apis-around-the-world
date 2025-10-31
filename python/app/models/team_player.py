from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from app.models.player import Player
    from app.models.team import Team


class TeamPlayer(Base):
    __tablename__ = "team_players"

    team_id: Mapped[int] = mapped_column(
        ForeignKey("python.teams.id", ondelete="CASCADE"), primary_key=True
    )
    player_id: Mapped[int] = mapped_column(
        ForeignKey("python.players.id", ondelete="CASCADE"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="team_players")
    player: Mapped["Player"] = relationship("Player", back_populates="team_players")