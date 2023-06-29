import pytest

from ..fixtures.tests_consts import (
    player_id,
    player,
    extra_player_id,
    extra_player,
    extra_player_with_word,
    DUMMY_DICTIONARY,
    DUMMY_LETTERS,
    DUMMY_WORDS,
)

from ..app.board import Board
from ..app.exceptions import (
    MissingLettersForWordException,
    NoLettersLeftException,
    InvalidWordException,
    NoStealAvaliableException,
)


def flip_by_count(board, count):
    for _ in range(count):
        board.flip_letter()


def test_flip():
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    assert len(board.current_letters()) == 0
    flip_by_count(board, 4)
    assert len(board.current_letters()) == 4
    with pytest.raises(NoLettersLeftException):
        board.flip_letter()


def test_take_valid_word(player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    board.take_word(player, "this")
    assert len(board.current_letters()) == 0


def test_take_invalid_word(player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    with pytest.raises(InvalidWordException):
        board.take_word(player, "thsi")


def test_take_word_wih_missing_letters(player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    with pytest.raises(MissingLettersForWordException):
        board.take_word(player, DUMMY_WORDS[0])


def test_steal_valid_word(extra_player_with_word, player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    assert len(board.current_letters()) == 4
    board.steal_word(DUMMY_WORDS[1], player, extra_player_with_word)
    assert len(board.current_letters()) == 3


def test_steal_invalid_word(extra_player_with_word, player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 1)
    with pytest.raises(InvalidWordException):
        board.steal_word("frite", player, extra_player_with_word)


def test_steal_non_existent_word(extra_player_with_word, player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 1)
    with pytest.raises(NoStealAvaliableException):
        board.steal_word(DUMMY_WORDS[3], player, extra_player_with_word)


def test_steal_valid_word_from_self(extra_player_with_word):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    assert len(board.current_letters()) == 4
    board.steal_word(DUMMY_WORDS[1], extra_player_with_word, extra_player_with_word)
    assert len(board.current_letters()) == 3
