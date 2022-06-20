class BaseAnagramsException(Exception):
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
