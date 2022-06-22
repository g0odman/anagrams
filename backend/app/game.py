import asyncio
import random
from typing import List
from dataclasses import asdict

from backend.app.player_manager import get_player_by_id
from .board import Board
from .exceptions import NonAlphabeticStringsException, NonExistentPlayerException, OutOfTurnFlipException
from .game_setup import get_words, get_letters_order
from .player import Player


class Game(object):
    def __init__(self, creator_id: int):
        self._creator_id = creator_id
        self._board = Board(get_letters_order(), get_words())
        self._players = []  # type: list[Player]
        self._current_player_id = self._choose_starting_player()
        self._default_player_id = self._choose_starting_player()
        self._event = asyncio.Event()
        self.add_player(creator_id)

    async def wait_for_change(self):
        await self._event.wait()
        self._event.clear()

    def _set_changed(self):
        self._event.set()

    def _end_turn_hooks(self, player_id: int):
        self._current_player_id = player_id
        self._default_player_id = player_id
        self._set_changed()

    def add_player(self, player_id: int):
        player = get_player_by_id(player_id=player_id)
        self._players.append(player)

    def remove_player(self, player_id: int):
        player = get_player_by_id(player_id=player_id)
        self._players.append(player)

    def _get_player(self, player_id: int):
        player = get_player_by_id(player_id=player_id)
        if player not in self._players:
            raise NonExistentPlayerException(player_id)
        return player

    def _next_player(self):
        next_player = (self._current_player_id + 1) % len(self._players)
        self._end_turn_hooks(next_player)

    def _choose_starting_player(self):
        return random.randint(0, len(self._players) - 1)

    @staticmethod
    def sanitize_word(word: str):
        if not word.isalpha():
            raise NonAlphabeticStringsException(word)
        return word.lower()

    def steal(self, player_id: int, target_player_id: int, word: str):
        word = self.sanitize_word(word)
        player = self._get_player(player_id)
        target_player = self._get_player(target_player_id)
        self._board.steal_word(word, player, target_player)
        self._end_turn_hooks(player_id)

    def take(self, player_id: int, word: str):
        word = self.sanitize_word(word)
        player = self._get_player(player_id)
        self._board.take_word(player, word)
        self._end_turn_hooks(player_id)

    def flip(self, player_id: int):
        if player_id == self._current_player_id:
            result = self._board.flip_letter()
            self._next_player()
            return result
        raise OutOfTurnFlipException(
            f'Current player: {self._current_player_id} != {player_id}')

    def remaining_letters_count(self):
        return self._board.remaining_letters_count()

    def players(self):
        return self._players

    def current_letters(self):
        return self._board.current_ordered_letters()

    def to_json(self):
        return {
            'letters': list(map(asdict, self.current_letters())),
            'players': list(map(asdict, self.players())),
            'remainingLetters': self.remaining_letters_count(),
            'currentPlayerID': self._current_player_id,
            'defaultPlayerID': self._default_player_id,
        }
