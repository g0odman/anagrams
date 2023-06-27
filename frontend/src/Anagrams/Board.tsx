import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  backgroundColor: '#E3CFAA',
  height: 60,
  width: 60,
  top: '50%',
}));
export type OrderedLetterProps = {
  letter: string,
  letterID: number
}

function Letter(props: OrderedLetterProps) {
  return (
    <Grid item xs={2} key={props.letterID}>
      <Item elevation={3}>
        <Typography variant="h5" component="div" sx={{ p: 2 }}>
          <strong>{props.letter.toUpperCase()}</strong>
        </Typography>
      </Item>
    </Grid>
  );
}
export function Board(props: { letters: OrderedLetterProps[]; }) {
  const letters = props.letters.map(letter => Letter(letter));
  return (
    <Grid container spacing={2}
      alignItems="center"
      justifyContent="center"
      marginBottom={10}>
      {letters}
    </Grid>
  );
}
