from backend.app.exceptions import BaseAnagramsException
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .game import Game

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


class temp(object):
    form = {
        'word-to-take': "word",
        'word-to-steal': 'word'
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.exception_handler(BaseAnagramsException)
async def unicorn_exception_handler(request: Request, exc: BaseAnagramsException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {repr(exc)}"},
    )


@ app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}


game = Game(['Uri'])


@ app.post("/game/flip", tags=["root"])
async def flip():
    game.flip(0)
    return {}


@ app.post("/game/take", tags=["root"])
async def take(body: dict) -> dict:
    try:
        game.take(0, body['takenWord'])
    except Exception as e:
        print(repr(e))
    return {}


@ app.post("/game/steal", tags=["root"])
async def steal(body: dict):
    try:
        game.steal(0, body['targetPlayer'], body['takenWord'])
    except Exception as e:
        print(repr(e))
    return {}


@ app.get("/game/data", tags=["root"])
async def game_data():
    return game.to_json()
