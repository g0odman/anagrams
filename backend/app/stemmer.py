from nltk.stem.lancaster import LancasterStemmer


def are_same_stem(word1: str, word2: str):
    stemmer = LancasterStemmer()
    stem1 = stemmer.stem(word1)
    stem2 = stemmer.stem(word2)
    return stem1 == stem2
