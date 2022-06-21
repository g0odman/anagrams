from dataclasses import dataclass, field

from typing import List


@dataclass
class Player(object):
    name: str
    playerID: int
    words: List[str] = field(default_factory=list)

    def add_word(self, word):
        self.words.append(word)

    def remove_word(self, word):
        self.words.remove(word)

    def score(self):
        return sum(map(len, self.words)) - 3 * len(self.words)
