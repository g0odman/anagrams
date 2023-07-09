import logging
from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from .player_manager import (
    create_player_from_name,
    get_game_id_by_player,
    get_player_by_id,
)

from .game_manager import (
    add_player_to_game,
    create_game_by_creator,
    get_game_by_id,
    remove_player_from_game,
)

from .exceptions import BaseAnagramsException, NonExistentGameException

logging.basicConfig(level=logging.DEBUG)

app = FastAPI(docs_url="/api/docs", debug=True)

app.mount("/static", StaticFiles(directory="/build/static"), name="static")


@app.exception_handler(BaseAnagramsException)
async def anagrams_exception_handler(request: Request, exc: BaseAnagramsException):
    print(f"Oops! {repr(exc)}")
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {repr(exc)}"},
    )


@app.post("/api/game/flip", tags=["root"])
async def flip(body: dict):
    game = get_game_by_id(body["gameID"])
    game.flip(body["playerID"])
    return {}


@app.post("/api/game/take", tags=["root"])
async def take(body: dict) -> dict:
    game = get_game_by_id(body["gameID"])
    game.take(body["playerID"], body["takenWord"])
    return {}


@app.post("/api/game/{game_id}/join", tags=["root"])
async def join_game(game_id: int, body: dict):
    player_id = body["playerID"]
    add_player_to_game(player_id, game_id)
    return {}


@app.post("/api/game/{game_id}/leave", tags=["root"])
async def leave_game(game_id: int, body: dict):
    player_id = body["playerID"]
    remove_player_from_game(player_id, game_id)
    return {}


@app.post("/api/game/create", tags=["root"])
async def create_game(body: dict):
    player_id = body["playerID"]
    game_id = create_game_by_creator(player_id)
    return {"gameID": game_id}


@app.post("/api/player/create", tags=["root"])
async def create_player(body: dict):
    print("HEre!")
    player_id = create_player_from_name(body["playerName"])
    return {"playerID": player_id}


@app.post("/api/player/{player_id}/name", tags=["root"])
async def get_player_name(player_id: int):
    player = get_player_by_id(player_id=player_id)
    return {"playerName": player.name}


@app.post("/api/player/{player_id}/game", tags=["root"])
async def get_player_game(player_id: int):
    game_id = get_game_id_by_player(player_id=player_id)
    if game_id is None:
        raise NonExistentGameException(player_id)
    return {"gameID": game_id}


@app.post("/api/player/{player_id}/delete", tags=["root"])
async def delete_player(player_id: int):
    player = get_player_by_id(player_id=player_id)
    return {"playerName": player.name}


@app.websocket("/api/game/{game_id}/ws")
async def websocket_endpoint(game_id: int, websocket: WebSocket):
    await websocket.accept()
    game = get_game_by_id(game_id=game_id)
    while True:
        await websocket.send_json(game.to_json())
        await game.wait_for_change()


@app.get("/")
async def serve_spa():
    return FileResponse("/build/index.html")
