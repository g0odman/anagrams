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

  // useEffect(() => {
  //   fetchFromServer("game/" + gameID + "/data", "", setErrorMessage, setGameData);
  // }, []);
  useEffect(() => {
    const url = "ws://localhost:8000/game/" + gameID + "/ws";
    const ws = new WebSocket(url);

    // recieve message every start page
    ws.onmessage = (e) => {
      const receivedGameData = JSON.parse(e.data);
      setGameData(receivedGameData);
    };

    //clean up function when we close page
    return () => ws.close();
  }, []);

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
