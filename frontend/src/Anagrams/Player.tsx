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
import TableHead from '@mui/material/TableHead/TableHead';
export interface PlayerProps {
  name: string,
  playerID: number,
  words: string[],
}

function PlayerWord(props: { word: string }) {
  return (<TableRow key={props.word}>
    <Typography gutterBottom variant="h5" component="div">
      <TableCell>{props.word.toUpperCase()}</TableCell>
    </Typography>
  </TableRow>)
}



export function PlayerList(props: { players: PlayerProps[]; }) {
  const players = props.players.map((player) => {
    return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h4" >{player.name}</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {player.words.map((word) => (
                  PlayerWord({ word: word })
                ))}
              </TableBody>
            </Table>
          </TableContainer>
    );
  });
  return (<Grid container spacing={8} alignItems="center" justifyContent="center">
    {players}
  </Grid>);
}
