
from .player_manager import get_game_id_by_player, is_player_in_game, update_player_status
from .exceptions import AlreadyJoinedException, NonExistentGameException, PlayerInGameAlreadyException
from .game import Game
from random import randint


_games = {}  # type: dict[int, Game]


def get_game_by_id(game_id: int) -> Game:
    if game_id not in _games:
        raise NonExistentGameException(game_id)
    return _games[game_id]


def create_game_by_creator(player_id: int):
    if is_player_in_game(player_id):
        raise PlayerInGameAlreadyException(player_id)
    game_id = randint(0, 2 ** 32)
    while game_id in _games:
        game_id = randint(0, 2 ** 32)
    _games[game_id] = Game(player_id)
    add_player_to_game(player_id=player_id, game_id=game_id)
    return game_id


def add_player_to_game(player_id: int, game_id: int):
    if is_player_in_game(player_id):
        if get_game_id_by_player(player_id) == game_id:
            raise AlreadyJoinedException(player_id)
        # TODO: separate these exceptions
        raise AlreadyJoinedException(player_id)
    game = get_game_by_id(game_id)
    game.add_player(player_id)
    update_player_status(player_id, game_id)


def remove_player_from_game(player_id: int, game_id: int):
    if not is_player_in_game(player_id):
        # TODO: better exception
        raise AlreadyJoinedException(player_id)
    if not get_game_id_by_player(player_id) == game_id:
        raise AlreadyJoinedException(player_id)
    game = get_game_by_id(game_id)
    game.remove_player(player_id)
    update_player_status(player_id)
