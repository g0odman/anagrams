
from .exceptions import NonExistentGameException
from .game import Game
from random import randint


_games = {}


def get_game_by_id(game_id: int):
    if game_id not in _games:
        raise NonExistentGameException(game_id)
    return _games[game_id]


def create_game(player_id: int):
    game_id = randint(0, 2 ** 32)
    while game_id in _games:
        game_id = randint(0, 2 ** 32)
    _games[game_id] = Game(player_id)
