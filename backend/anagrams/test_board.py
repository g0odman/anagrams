import pytest

from anagrams.board import Board
from anagrams.exceptions import MissingLettersForWordException, NoLettersLeftException, InvalidWordException, \
    NoStealAvaliableException
from anagrams.player import Player

DUMMY_DICTIONARY = ['fire', 'fries', 'this', 'lifers']
DUMMY_LETTERS = ['h', 'i', 't', 's']
DUMMY_WORD = 'fries'


@pytest.fixture
def player():
    return Player('dummy2')


@pytest.fixture
def player_with_word():
    return Player('dummy_with_word', ['fire'])


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
    board.take_word(player, 'this')
    assert len(board.current_letters()) == 0


def test_take_invalid_word(player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    with pytest.raises(InvalidWordException):
        board.take_word(player, 'thsi')


def test_take_word_wih_missing_letters(player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    with pytest.raises(MissingLettersForWordException):
        board.take_word(player, 'fire')


def test_steal_valid_word(player_with_word, player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    assert len(board.current_letters()) == 4
    board.steal_word('fries', player, player_with_word)
    assert len(board.current_letters()) == 3


def test_steal_invalid_word(player_with_word, player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 1)
    with pytest.raises(InvalidWordException):
        board.steal_word('frite', player, player_with_word)


def test_steal_non_existent_word(player_with_word, player):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 1)
    with pytest.raises(NoStealAvaliableException):
        board.steal_word('lifers', player, player_with_word)


def test_steal_valid_word_from_self(player_with_word):
    board = Board(DUMMY_LETTERS.copy(), DUMMY_DICTIONARY)
    flip_by_count(board, 4)
    assert len(board.current_letters()) == 4
    board.steal_word('fries', player_with_word, player_with_word)
    assert len(board.current_letters()) == 3
