import random
from typing import List

from anagrams.board import Board
from anagrams.exceptions import OutOfTurnFlipException
from anagrams.letters import get_words, get_letters_order
from anagrams.player import Player


class Game(object):
    def __init__(self, player_names: List[str]):
        self._board = Board(get_letters_order(), get_words())
        self._players = [Player(name) for name in player_names]
        self._current_player_id = self._choose_starting_player()

    def _get_player(self, player_id: int):
        return self._players[player_id]

    def _next_player(self):
        self._current_player_id = (self._current_player_id + 1) % len(self._players)
        print(f'{self._players[self._current_player_id].name}\'s turn')

    def _choose_starting_player(self):
        return random.randint(0, len(self._players) - 1)

    def steal(self, player_id, target_player_id, word):
        player = self._get_player(player_id)
        target_player = self._get_player(target_player_id)
        self._board.steal_word(word, player, target_player)
        self._current_player_id = player_id

    def take(self, player_id: int, word: str):
        player = self._get_player(player_id)
        self._board.take_word(player, word)
        self._current_player_id = player_id

    def flip(self, player_id: int):
        if player_id == self._current_player_id:
            result = self._board.flip_letter()
            print('Revealed letter:', result)
            self._next_player()
            return result
        raise OutOfTurnFlipException(f'Current player: {self._current_player_id} != {player_id}')

    def remaining_letters_count(self):
        return self._board.remaining_letters_count()

    def players(self):
        return self._players

    def current_letters(self):
        return self._board.current_letters()

    def to_json(self):
        return {
            'boardLetters' : self.current_letters(),
            'players' : [player.to_json() for player in self.players()],
            'remainingLetters' : self.remaining_letters_count(),
            'currentPlayerID' : self._current_player_id
        }