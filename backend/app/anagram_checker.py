from collections import Counter
from typing import List

from .stemmer import are_same_stem

from .exceptions import NoStealAvaliableException


def is_word_avaliable(word: str, letters: List[str]) -> bool:
    word_counter = Counter(word)
    avaliable_letters = Counter(letters)
    return all(
        avaliable_letters[letter] >= word_counter[letter] for letter in word_counter
    )


def get_steal(word: str, player_words: List[str], letters: List[str]) -> str:
    dst_word = Counter(word)
    avaliable_letters = Counter(letters)
    for player_word in player_words:
        player_word_counter = Counter(player_word)
        if can_steal_word(
            word, dst_word, avaliable_letters, player_word, player_word_counter
        ):
            return player_word
    raise NoStealAvaliableException(word)


def can_steal_word(
    word: str,
    dst_word: Counter,
    avaliable_letters: Counter,
    player_word: str,
    player_word_counter: Counter,
):
    if len(word) <= len(player_word):
        return False
    if any(letter not in dst_word for letter in player_word_counter):
        return False
    for letter in dst_word:
        if not can_steal_letter(
            dst_word, avaliable_letters, player_word_counter, letter
        ):
            return False
    if are_same_stem(word, player_word):
        # TODO: raise an exception here and throw if all the words fail
        return False
    return True


def can_steal_letter(
    dst_word: Counter, avaliable_letters: Counter, player_word: Counter, letter: str
) -> bool:
    return (
        player_word[letter] <= dst_word[letter]
        and player_word[letter] + avaliable_letters[letter] >= dst_word[letter]
    )


def get_needed_letters(src_word: str, dst_word: str):
    dst_word_letters = list(dst_word)
    for letter in src_word:
        dst_word_letters.remove(letter)
    return dst_word_letters
