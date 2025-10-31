from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    __table_args__ = {"schema": "python"}


from app.models.player import Player
from app.models.team import Team
from app.models.team_player import TeamPlayer
from app.models.match import Match
from app.models.set import Set
from app.models.game import Game
from app.models.point import Point

# Export everything for easy importing elsewhere
__all__ = [
    "Base",
    "MatchType",
    "Status",
    "Player",
    "Team", 
    "TeamPlayer",
    "Match",
    "Set",
    "Game",
    "Point",
]