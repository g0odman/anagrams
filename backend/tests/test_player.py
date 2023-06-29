import pytest

from ..fixtures.tests_consts import player_id, player, DUMMY_WORD

from ..app.player import Player


def test_add_word(player):
    player.add_word(DUMMY_WORD)
    assert DUMMY_WORD in player.words


def test_remove_word(player):
    player.add_word(DUMMY_WORD)
    player.remove_word(DUMMY_WORD)
    assert len(player.words) == 0


def test_remove_word_fails(player):
    with pytest.raises(ValueError):
        player.remove_word(DUMMY_WORD)


def test_score(player):
    player.add_word(DUMMY_WORD)
    assert player.score() == 2
