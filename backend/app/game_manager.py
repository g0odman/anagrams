
from .exceptions import AlreadyJoinedException, NonExistentGameException
from .game import Game
from random import randint


_games = {}  # type: dict[int, Game]
_games_by_player = {}  # type: dict[int, int]


def get_game_by_id(game_id: int) -> Game:
    if game_id not in _games:
        raise NonExistentGameException(game_id)
    return _games[game_id]


def create_game_by_creator(player_id: int):
    assert player_id not in _games_by_player
    game_id = randint(0, 2 ** 32)
    while game_id in _games:
        game_id = randint(0, 2 ** 32)
    _games[game_id] = Game(player_id)


def add_player_to_game(player_id: int, game_id: int):
    if _games_by_player.get(player_id, None) == game_id:
        # Already joined
        raise AlreadyJoinedException(player_id)
    assert player_id not in _games_by_player
    game = get_game_by_id(game_id)
    game.add_player(player_id)
    _games_by_player[player_id] = game_id


def remove_player_from_game(player_id: int, game_id: int):
    if _games_by_player.get(player_id, None) != game_id:
        # Already joined
        raise AlreadyJoinedException(player_id)
    game = get_game_by_id(game_id)
    game.remove_player(player_id)
    del _games[player_id]


def get_game_id_by_player(player_id: int):
    if not is_player_in_game(player_id=player_id):
        raise NonExistentGameException(player_id)
    return _games_by_player[player_id]


def is_player_in_game(player_id):
    return player_id in _games_by_player
