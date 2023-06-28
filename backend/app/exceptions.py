from lib2to3.pytree import Base


class BaseAnagramsException(Exception):
    pass


class PlayerInGameAlreadyException(BaseAnagramsException):
    pass


class NonExistentPlayerException(BaseAnagramsException):
    pass


class NonAlphabeticStringsException(BaseAnagramsException):
    pass


class NonExistentGameException(BaseAnagramsException):
    pass


class InvalidStealException(BaseAnagramsException):
    pass


class InvalidWordException(BaseAnagramsException):
    pass


class OutOfTurnFlipException(BaseAnagramsException):
    pass


class NoStealAvaliableException(BaseAnagramsException):
    pass


class MissingLettersForWordException(BaseAnagramsException):
    pass


class NoLettersLeftException(BaseAnagramsException):
    pass


class InvalidStateException(BaseAnagramsException):
    pass
