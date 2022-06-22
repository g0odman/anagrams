
from random import randint
from .exceptions import NonExistentPlayerException
from .player import Player


_players = {}


def get_player_by_id(player_id: int) -> Player:
    if player_id not in _players:
        raise NonExistentPlayerException(player_id)
    return _players[player_id]


def create_player(player_name: str):
    player_id = randint(0, 2 ** 32)
    while player_id in _players:
        player_id = randint(0, 2 ** 32)
    _players[player_id] = Player(name=player_name, playerID=player_id)
