import os

from flask import Flask, render_template, request, flash

from anagrams.game import Game

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

game = Game(['Uri'])


@app.post("/game/flip", tags=["root"])
def flip():
    game.flip(0)
    return game.to_json()


@app.post("/game/take", tags=["root"])
def take():
    try:
        game.take(0, request.form['word-to-take'])
    except Exception as e:
        flash(repr(e))
    return game.to_json()


@app.post("/game/steal", tags=["root"])
def steal():
    try:
        game.steal(0, 0, request.form['word-to-steal'])
    except Exception as e:
        flash(repr(e))
    return game.to_json()


@app.route('/')
def hello_world():
    return game.to_json()


if __name__ == '__main__':
    app.run()
