import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead/TableHead';
export interface PlayerProps {
    name: string,
    playerID: number,
    words: string[],
}

function PlayerWord(word: string) {
    if (!word) {
        return <TableCell></TableCell>
    }
    return <TableCell>{word.toUpperCase()}</TableCell>
}
function createRow(wordsList: string[][], index: number) {
    return <TableRow>
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
    return <div>{rows}</div>
}

function PlayerNamesDisplay(players: PlayerProps[]) {
    return <TableRow>
        {players.map(PlayerNameDisplay)}
    </TableRow>
}

function PlayerNameDisplay(player: PlayerProps) {
    return <TableCell>
        <Typography variant="h4">{player.name}</Typography>
    </TableCell>;
}

export function PlayerList(props: { players: PlayerProps[]; }) {
    const playerNames = PlayerNamesDisplay(props.players)
    const playerWords = PlayerWordsDisplay(props.players);
    return (<Grid container spacing={8} alignItems="center" justifyContent="center">
        <Table sx={{ minWidth: 100 }} size="small" aria-label="simple table">
            <TableHead>
                {playerNames}
            </TableHead>
            <TableBody>
                {playerWords}
            </TableBody>
        </Table>
    </Grid>);
}