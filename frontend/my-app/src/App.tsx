import './App.css';

import { Actions } from './Anagrams/Actions';
import { PlayerList, PlayerProps } from './Anagrams/Player';
import { GameInfo } from './Anagrams/GameInfo';
import { Board, OrderedLetterProps } from './Anagrams/Board';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';



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
  let gameID = 0
  const [errorMessage, setErrorMessage] = useState("");
  const [gameData, setGameData] = useState({
    letters: [],
    players: [],
    remainingLetters: 0,
    currentPlayerID: 0,
    defaultPlayerID: 0
  });
  const fetchGameData = async () => {
    fetch("http://localhost:8000/game/" + gameID + "/data").then(async response => {
      const gameData = await response.json()

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        setErrorMessage((gameData && gameData.message) || response.statusText);

      } else {
        setGameData({
          letters: gameData.boardLetters,
          currentPlayerID: gameData.currentPlayerID,
          players: gameData.players,
          remainingLetters: gameData.remainingLetters,
          defaultPlayerID: gameData.defaultPlayerID
        })
      }
      ;

    })
  }
  useEffect(() => {
    fetchGameData()
  },
    []);
  let display: JSX.Element;
  if (!errorMessage) {
    display = (
      <div>
        <Game gameData={gameData}></Game>
        <Actions players={gameData.players} defaultPlayerID={gameData.defaultPlayerID} gameID={gameID} />
      </div>
    );
  } else {
    display = (<Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      This is an error alert — <strong>{errorMessage}</strong>
    </Alert>);
  }
  return (
    <div className="App">
      <header className="App-header">
        {display}
      </header>
    </div>
  );
}

export default App;
