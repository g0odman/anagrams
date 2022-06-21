
from .exceptions import NonExistentGameException
from .game import Game


_games = {0: Game(['Uri'])}


def get_game_by_id(game_id):
    if game_id not in _games:
        raise NonExistentGameException(game_id)
    return _games[game_id]
