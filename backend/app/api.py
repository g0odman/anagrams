import asyncio
from typing import Union
from fastapi import Cookie, FastAPI, Request, WebSocket, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.player_manager import create_player_from_name, get_player_by_id

from .game_manager import add_player_to_game, create_game_by_creator, get_game_by_id, remove_player_from_game

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
async def anagrams_exception_handler(request: Request, exc: BaseAnagramsException):
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


@app.post("/game/{game_id}/join", tags=["root"])
async def join_game(game_id: int, body: dict):
    player_id = body['playerID']
    add_player_to_game(player_id, game_id)
    return {}


@app.post("/game/{game_id}/leave", tags=["root"])
async def leave_game(game_id: int, body: dict):
    player_id = body['playerID']
    remove_player_from_game(player_id, game_id)
    return {}


@app.post("/game/create", tags=["root"])
async def create_game(playerID: Union[str, None] = Cookie(default=None)):
    assert playerID is not None
    game_id = create_game_by_creator(int(playerID))
    return {'gameID': game_id}


@app.post("/player/create", tags=["root"])
async def create_player(body: dict, response: Response):
    player_id = create_player_from_name(body['playerName'])
    return {'playerID': player_id}


@app.post("/player/{player_id}/name", tags=["root"])
async def get_player_name(player_id: int):
    player = get_player_by_id(player_id=player_id)
    return {'playerName': player.name}


@app.post("/player/{player_id}/delete", tags=["root"])
async def delete_player(player_id: int):
    player = get_player_by_id(player_id=player_id)
    return {'playerName': player.name}


@app.websocket("/game/{game_id}/ws")
async def websocket_endpoint(game_id: int, websocket: WebSocket):
    await websocket.accept()
    game = get_game_by_id(game_id=game_id)
    while True:
        await websocket.send_json(game.to_json())
        await game.wait_for_change()
