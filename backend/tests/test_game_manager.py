import pytest

from ..app.exceptions import InvalidStateException, NonExistentGameException
from ..app.game_manager import (
    add_player_to_game,
    create_game_by_creator,
    remove_player_from_game,
)
from ..app.player_manager import get_game_id_by_player, is_player_in_game
from ..fixtures.tests_consts import player_id, extra_player_id


def test_add_player_to_game(player_id, extra_player_id):
    game_id = create_game_by_creator(player_id)
    add_player_to_game(extra_player_id, game_id)
    assert get_game_id_by_player(extra_player_id) == game_id
    assert get_game_id_by_player(player_id) == game_id
    assert is_player_in_game(player_id)
    assert is_player_in_game(extra_player_id)


def test_remove_player_from_game(player_id, extra_player_id):
    game_id = create_game_by_creator(player_id)
    add_player_to_game(extra_player_id, game_id)
    remove_player_from_game(extra_player_id, game_id)
    with pytest.raises(NonExistentGameException):
        remove_player_from_game(extra_player_id, game_id)
    with pytest.raises(NonExistentGameException):
        get_game_id_by_player(extra_player_id)
    assert get_game_id_by_player(player_id) == game_id
    assert is_player_in_game(player_id)
    assert not is_player_in_game(extra_player_id)
