import React from 'react';
import { PlayerProps } from './Player';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
function resolvePlayerName(playerID: number, players: PlayerProps[]) {
  return players.find(player => player.playerID === playerID)?.name;
}
export function GameInfo(props: { gameID: number, remainingLetters: number, currentPlayerID: number, players: PlayerProps[] }) {
  return (<Typography
    component="h1"
    variant="h5"
    align="left"
    color="text.primary"
    gutterBottom
  >
    <Stack
      sx={{ pt: 4 }}
      direction="row"
      spacing={2}
      justifyContent="center"
    >
      <div><SportsHockeyIcon />Game ID: {props.gameID}</div>
      <div><TableRowsIcon />Remaining letters count: {props.remainingLetters}</div>
      <div><HourglassFullIcon />Next turn: {resolvePlayerName(props.currentPlayerID, props.players)}</div>

    </Stack>
  </Typography>

  );
}
