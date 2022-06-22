import './App.css';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useEffect, useState } from 'react';
import { Actions } from './Anagrams/Actions';
import { Board, OrderedLetterProps } from './Anagrams/Board';
import { GameInfo } from './Anagrams/GameInfo';
import { PlayerList, PlayerProps } from './Anagrams/Player';
import { LobbyForm } from './Lobby/Lobby';
import { LoginForm } from './Lobby/Login';
import { getGameID, usePlayerID } from './Lobby/useToken';



type GameData = {
  letters: OrderedLetterProps[],
  players: PlayerProps[],
  remainingLetters: number,
  currentPlayerID: number,
  defaultPlayerID: number
}

function RunningGame(props: { gameData: GameData }) {
  return <div>
    <GameInfo
      title="Anagrams"
      remainingLetters={props.gameData.remainingLetters}
      currentPlayerID={props.gameData.currentPlayerID} />
    <Board letters={props.gameData.letters} />
    <PlayerList players={props.gameData.players} />
  </div>;
}
function Game(props: { playerID: number, gameID: number }) {
  const [errorMessage] = useState("");
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
    const url = "ws://localhost:8000/game/" + props.gameID + "/ws";
    const ws = new WebSocket(url);

    // recieve message every start page
    ws.onmessage = (e) => {
      const receivedGameData = JSON.parse(e.data);
      setGameData(receivedGameData);
    };

    //clean up function when we close page
    return () => ws.close();
  }, [props.gameID]);

  if (!errorMessage) {
    return (
      <div>
        <RunningGame gameData={gameData}></RunningGame >
        <Actions players={gameData.players} defaultPlayerID={gameData.defaultPlayerID} gameID={props.gameID} playerID={props.playerID} />
      </div>
    );
  } else {
    return (<Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      This is an error alert — <strong>{errorMessage}</strong>
    </Alert>);
  }
}

function MyRouter(props: {}) {
  const { playerID, setPlayerID } = usePlayerID();
  const [gameID, setGameID] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      if (playerID) {
        const newGameID = await getGameID(playerID);
        setGameID(newGameID);
      }
      console.log('Using effect(' + playerID + ', ' + gameID + ')')
    }
    )();

  }, [playerID, gameID]);
  if (!playerID) {
    return (<LoginForm setPlayerID={setPlayerID}></LoginForm>);
  }
  if (!gameID) {
    return <LobbyForm playerID={playerID} setGameID={setGameID}></LobbyForm>
  }
  return <Game playerID={playerID} gameID={gameID}></Game>
}
function App() {

  return (
    <div className="App">
      <header className="App-header">
        <MyRouter></MyRouter>
      </header>
    </div>
  );
}

export default App;
