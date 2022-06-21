import json
import os
import random

RESOURCES_DIR = os.path.join(os.path.dirname(__file__), 'resources')


def word_filter(word):
    return len(word) >= 4


def _get_letters_count():
    with open(os.path.join(RESOURCES_DIR, 'letters.json')) as f:
        return json.load(f)


def _get_letters_list():
    letters_by_count = _get_letters_count()
    output = list()
    for letter, count in letters_by_count.items():
        output.extend(letter * count)
    return output


def get_letters_order():
    letters = _get_letters_list()
    random.shuffle(letters)
    return letters


def _read_words():
    with open(os.path.join(RESOURCES_DIR, 'words.txt')) as f:
        all_words = f.readlines()
    return map(str.strip, all_words)


def get_words():
    return set(filter(word_filter, _read_words()))
