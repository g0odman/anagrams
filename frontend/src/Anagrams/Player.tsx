import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CardContent from '@mui/material/CardContent';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell'
export interface PlayerProps {
  name: string,
  playerID: number,
  words: string[],
}

function PlayerWord(props: { word: string }) {
  return (<TableRow key={props.word}>

    <Typography gutterBottom variant="h6" component="div">
      <TableCell>{props.word}</TableCell>
    </Typography>
  </TableRow>)
}


function Player(props: PlayerProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 100 }} aria-label="simple table">
            <TableBody>
              {props.words.map((word) => (
                PlayerWord({ word: word })
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
export function PlayerList(props: { players: PlayerProps[]; }) {
  const players = props.players.map((player) => {
    return (<Grid item key={player.playerID}>
      <Player name={player.name} words={player.words} playerID={player.playerID} />
    </Grid>
    );
  });
  return (<Grid container spacing={8} alignItems="center" justifyContent="center">
    {players}
  </Grid>);
}