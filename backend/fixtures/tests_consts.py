import pytest

from ..app.player import Player

from ..app.player_manager import create_player_from_name, get_player_by_id

DUMMY_NAME = "dummy"
EXTRA_DUMMY_NAME = "dummy2"
DUMMY_WORD = "dummy"
DUMMY_ID = 1
DUMMY_WORDS = ["fire", "fries", "this", "lifers"]
DUMMY_DICTIONARY = set(DUMMY_WORDS)
DUMMY_LETTERS = ["h", "i", "t", "s"]


@pytest.fixture
def player_id() -> int:
    return create_player_from_name(DUMMY_NAME)


@pytest.fixture
def player(player_id) -> Player:
    return get_player_by_id(player_id)


@pytest.fixture
def extra_player_id() -> int:
    return create_player_from_name(EXTRA_DUMMY_NAME)


@pytest.fixture
def extra_player(extra_player_id) -> Player:
    return get_player_by_id(extra_player_id)


@pytest.fixture
def extra_player_with_word(extra_player) -> Player:
    extra_player.add_word(DUMMY_WORDS[0])
    return extra_player
