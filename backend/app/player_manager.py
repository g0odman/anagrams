from random import randint
from typing import Optional

from .exceptions import NonExistentGameException, NonExistentPlayerException
from .player import Player


_players = {}  # type: dict[int, Player]

_games_by_player = {}  # type: dict[int, Optional[int]]


def get_game_id_by_player(player_id: int):
    if not is_player_in_game(player_id=player_id):
        raise NonExistentGameException(player_id)
    return _games_by_player[player_id]


def is_player_in_game(player_id: int):
    return _games_by_player[player_id] is not None


def get_player_by_id(player_id: int) -> Player:
    if player_id not in _players:
        raise NonExistentPlayerException(player_id)
    return _players[player_id]


def delete_player(player_id: int) -> None:
    assert not is_player_in_game(player_id=player_id)
    del _players[player_id]


def create_player_from_name(player_name: str) -> int:
    player_id = randint(0, 2**32)
    while player_id in _players:
        player_id = randint(0, 2**32)
    _players[player_id] = Player(name=player_name, playerID=player_id)
    _games_by_player[player_id] = None
    return player_id


def update_player_status(player_id: int, game_id: Optional[int] = None):
    _games_by_player[player_id] = game_id
