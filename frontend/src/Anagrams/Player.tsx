import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

export interface PlayerProps {
    name: string,
    playerID: number,
    words: string[],
}

function PlayerWord(word: string) {
    if (!word) {
        return <TableCell></TableCell>
    }
    return <TableCell align="center" >{word.toUpperCase()}</TableCell>
}
function createRow(wordsList: string[][], index: number) {
    return <TableRow key={index}>
        {wordsList.map(list => PlayerWord(list[index]))}
    </TableRow>
}
function PlayerWordsDisplay(players: PlayerProps[]) {
    const wordsList = players.map(player => (player.words));
    const maxLength = Math.max(...wordsList.map(list => (list.length)));
    let rows: JSX.Element[] = []
    for (let index = 0; index < maxLength; index++) {
        rows.push(createRow(wordsList, index));
    }
    return rows
}

function PlayerNameDisplay(player: PlayerProps) {
    return <TableCell align="center" >
        <Typography variant="h4">{player.name}</Typography>
    </TableCell>;
}

export function PlayerList(props: { players: PlayerProps[]; }) {
    const playerWords = PlayerWordsDisplay(props.players);
    return (<TableContainer component={Paper}>
        <Table>
            <TableHead>
                {props.players.map(PlayerNameDisplay)}
            </TableHead>
            <TableBody>
                {playerWords}
            </TableBody>
        </Table>
    </TableContainer>);
}