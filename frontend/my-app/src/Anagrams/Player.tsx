import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CardContent from '@mui/material/CardContent';

export interface PlayerProps {
  name: string,
  words: string[],
}

function PlayerWord(props: { word: string }) {
  return (<TableRow key={props.word}>
    <TableCell>{props.word}</TableCell>
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
    return (<Grid item><Player name={player.name} words={player.words}></Player></Grid>);
  });
  return (<Grid container spacing={8} alignItems="center" justifyContent="center">
    {players}
  </Grid>);
}
