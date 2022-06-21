import asyncio
from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .game_manager import get_game_by_id

from .exceptions import BaseAnagramsException
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


@ app.post("/game/{game_id}/flip", tags=["root"])
async def flip(game_id: int):
    game = get_game_by_id(game_id)
    game.flip(0)
    return {}


@ app.post("/game/{game_id}/take", tags=["root"])
async def take(game_id: int, body: dict) -> dict:
    game = get_game_by_id(game_id)
    game.take(0, body['takenWord'])
    return {}


@app.post("/game/{game_id}/steal", tags=["root"])
async def steal(game_id: int, body: dict):
    game = get_game_by_id(game_id)
    game.steal(0, body['targetPlayer'], body['takenWord'])
    return {}


@ app.get("/game/{game_id}/data", tags=["root"])
async def game_data(game_id: int):
    game = get_game_by_id(game_id)
    return game.to_json()


@app.websocket("/game/{game_id}/ws")
async def websocket_endpoint(game_id: int, websocket: WebSocket):
    await websocket.accept()
    game = get_game_by_id(game_id=game_id)
    while True:
        await websocket.send_json(game.to_json())
        await asyncio.sleep(3)
