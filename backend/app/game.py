import asyncio
import random
from dataclasses import asdict

from .player_manager import get_player_by_id
from .board import Board
from .exceptions import (
    MissingLettersForWordException,
    NoStealAvaliableException,
    NonAlphabeticStringsException,
    NonExistentPlayerException,
    OutOfTurnFlipException,
    WordTooShortException,
)
from .game_setup import get_words, get_letters_order
from .player import Player


class Game(object):
    INTERVAL = 5

    def __init__(self, creator_id: int, game_size: str):
        self._creator_id = creator_id
        self._board = Board(get_letters_order(game_size=game_size), get_words())
        self._players = []  # type: list[Player]
        self._current_player_id = creator_id
        self._default_player_id = creator_id
        self._event = asyncio.Event()

    async def wait_for_change(self):
        try:
            await asyncio.wait_for(self._event.wait(), timeout=self.INTERVAL)
        except asyncio.exceptions.TimeoutError:
            pass
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
        self._set_changed()

    def remove_player(self, player_id: int):
        player = get_player_by_id(player_id=player_id)
        self._players.append(player)
        self._set_changed()

    def _get_player(self, player_id: int):
        player = get_player_by_id(player_id=player_id)
        if player not in self._players:
            raise NonExistentPlayerException(player_id)
        return player

    def _next_player(self):
        for index, player in enumerate(self._players):
            if player.playerID == self._current_player_id:
                next_player = self._players[(index + 1) % len(self._players)]
                self._end_turn_hooks(next_player.playerID)
                return

    def _choose_starting_player(self):
        return random.randint(0, len(self._players) - 1)

    def start_game(self):
        self._choose_starting_player()

    @staticmethod
    def _sanitize_word(word: str) -> str:
        word = word.lower().strip()
        if len(word) < 4:
            raise WordTooShortException(word)
        if not word.isalpha():
            raise NonAlphabeticStringsException(word)
        return word

    def _steal(self, current_player: Player, word: str):
        for target_player in self._players:
            try:
                self._board.steal_word(word, current_player, target_player)
                return True
            except NoStealAvaliableException:
                pass
        return False

    def _take(self, player: Player, word: str):
        try:
            self._board.take_word(player, word)
            return True
        except MissingLettersForWordException:
            return False

    def take(self, player_id: int, word: str):
        word = self._sanitize_word(word)
        player = self._get_player(player_id)
        if self._steal(player, word):
            pass
        elif self._take(player, word):
            pass
        else:
            raise MissingLettersForWordException(word)
        self._end_turn_hooks(player_id)

    def flip(self, player_id: int):
        if player_id == self._current_player_id:
            result = self._board.flip_letter()
            self._next_player()
            return result
        raise OutOfTurnFlipException(
            f"Current player: {self._current_player_id} != {player_id}"
        )

    def remaining_letters_count(self) -> int:
        return self._board.remaining_letters_count()

    def players(self):
        return self._players

    def current_letters(self):
        return self._board.current_ordered_letters()

    def to_json(self):
        return {
            "letters": list(map(asdict, self.current_letters())),
            "players": list(map(asdict, self.players())),
            "remainingLetters": self.remaining_letters_count(),
            "currentPlayerID": self._current_player_id,
            "defaultPlayerID": self._default_player_id,
        }
