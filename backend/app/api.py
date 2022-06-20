from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


def create_status_code():
    # TODO: what do I do here?
    return {}


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}


game = Game(['Uri'])


@app.post("/game/flip", tags=["root"])
async def flip():
    game.flip(0)
    return create_status_code()


@app.post("/game/take", tags=["root"])
async def take(body: dict) -> dict:
    try:
        game.take(0, body['takenWord'])
    except Exception as e:
        print(repr(e))
    return create_status_code()


@app.post("/game/steal", tags=["root"])
async def steal(body: dict):
    try:
        game.steal(0, body['targetPlayer'], body['takenWord'])
    except Exception as e:
        print(repr(e))
    return create_status_code()


@app.get("/game/data", tags=["root"])
async def game_data():
    return game.to_json()
