import pytest

from .player import Player

DUMMY_NAME = 'dummy'
DUMMY_WORD = 'dummy'


@pytest.fixture
def dummy_player():
    return Player(DUMMY_NAME)


def test_add_word(dummy_player):
    dummy_player.add_word(DUMMY_WORD)
    assert DUMMY_WORD in dummy_player.words


def test_remove_word():
    dummy_player = Player(DUMMY_NAME, [DUMMY_WORD])
    dummy_player.remove_word(DUMMY_WORD)
    assert len(dummy_player.words) == 0


def test_remove_word_fails(dummy_player):
    with pytest.raises(ValueError):
        dummy_player.remove_word(DUMMY_WORD)


def test_score(dummy_player):
    dummy_player.add_word(DUMMY_WORD)
    assert dummy_player.score() == 2
