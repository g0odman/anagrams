
from random import randint

from backend.app.game_manager import is_player_in_game
from .exceptions import NonExistentPlayerException
from .player import Player


_players = {}  # type: dict[int, Player]


def get_player_by_id(player_id: int) -> Player:
    if player_id not in _players:
        raise NonExistentPlayerException(player_id)
    return _players[player_id]


def delete_player(player_id: int) -> None:
    assert not is_player_in_game(player_id=player_id)
    del _players[player_id]


def create_player_from_name(player_name: str) -> int:
    player_id = randint(0, 2 ** 32)
    while player_id in _players:
        player_id = randint(0, 2 ** 32)
    _players[player_id] = Player(name=player_name, playerID=player_id)
    return player_id
