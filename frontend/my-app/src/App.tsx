import './App.css';

import { Actions } from './Anagrams/Actions';
import { PlayerList, PlayerProps } from './Anagrams/Player';
import { GameInfo } from './Anagrams/GameInfo';
import { Board, OrderedLetterProps } from './Anagrams/Board';
import { useEffect, useState } from 'react';



type GameData = {
  letters: OrderedLetterProps[],
  players: PlayerProps[],
  remainingLetters: number,
  currentPlayerID: number,
  defaultPlayerID: number
}

function Game(props: { gameData: GameData }) {
  return <div>
    <GameInfo
      title="Anagrams"
      remainingLetters={props.gameData.remainingLetters}
      currentPlayerID={props.gameData.currentPlayerID} />
    <Board letters={props.gameData.letters} />
    <PlayerList players={props.gameData.players} />
  </div>;
}

function App() {
  const [gameData, setGameData] = useState({
    letters: [],
    players: [],
    remainingLetters: 0,
    currentPlayerID: 0,
    defaultPlayerID: 0
  });
  const fetchGameData = async () => {
    const response = await fetch("http://localhost:8000/game/data")
    const gameData = await response.json()
    setGameData({
      letters: gameData.boardLetters,
      currentPlayerID: gameData.currentPlayerID,
      players: gameData.players,
      remainingLetters: gameData.remaininingLetters,
      defaultPlayerID: gameData.defaultPlayerID
    });
  }
  useEffect(() => {
    fetchGameData()
  },
    []);
  return (
    <div className="App">
      <header className="App-header">
        <Game gameData={gameData}></Game>
        <Actions players={gameData.players} defaultPlayerID={gameData.defaultPlayerID} />
      </header>
    </div>
  );
}

export default App;
