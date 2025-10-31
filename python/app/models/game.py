from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, DateTime, ForeignKey, func, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from app.models.set import Set
    from app.models.point import Point


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    set_id: Mapped[int] = mapped_column(
        ForeignKey("python.sets.id", ondelete="CASCADE")
    )
    number_of_advantages: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True
    )
    winner_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    server_id: Mapped[int] = mapped_column(Integer)
    duration_in_ms: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True
    )
    status: Mapped[str] = mapped_column(
        String, server_default="INCOMPLETE"
    )
    start_time: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    set: Mapped["Set"] = relationship("Set", back_populates="games")
    points: Mapped[List["Point"]] = relationship(
        "Point", back_populates="game", cascade="all, delete-orphan"
    )