from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, func, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from app.models.match import Match
    from app.models.game import Game


class Set(Base):
    __tablename__ = "sets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(
        ForeignKey("python.matches.id", ondelete="CASCADE")
    )
    final_score: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    tiebreak_score: Mapped[Optional[str]] = mapped_column(
        String, nullable=True
    )
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

    # Relationships
    match: Mapped["Match"] = relationship("Match", back_populates="sets")
    games: Mapped[List["Game"]] = relationship(
        "Game", back_populates="set", cascade="all, delete-orphan"
    )