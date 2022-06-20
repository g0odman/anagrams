from typing import List, Optional

from .exceptions import NoStealAvaliableException


def is_word_avaliable(word: str, letters: List[str]):
    for letter in set(word):
        if word.count(letter) > letters.count(letter):
            return False
    return True


def get_steal(word: str, player_words: List[str], letters: List[str]) -> Optional[str]:
    for player_word in player_words:
        if len(player_word) >= len(word):
            continue
        total_letters = letters + list(player_word)
        if is_word_avaliable(word, total_letters):
            return player_word
    raise NoStealAvaliableException(word)


def get_needed_letters(src_word: str, dst_word: str):
    dst_word_letters = list(dst_word)
    for letter in src_word:
        dst_word_letters.remove(letter)
    return dst_word_letters
