
import AbcIcon from '@mui/icons-material/Abc';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from 'react';
import { LobbyForm } from './Lobby/Lobby';
import { LoginForm } from './Lobby/Login';
import { getGameID, usePlayerID } from './Lobby/useToken';
import { Game } from './Anagrams/Game'


const theme = createTheme();

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <AbcIcon sx={{ mr: 4 }}></AbcIcon>
          <Typography variant="h6" color="inherit" noWrap>
            Anagrams Game
          </Typography>
        </Toolbar>
      </AppBar>
      <MyRouter></MyRouter>
    </ThemeProvider>
  );
}

export default App;
