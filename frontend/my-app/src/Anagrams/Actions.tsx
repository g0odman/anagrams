import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import styled from '@mui/material/styles/styled';
import Paper from '@mui/material/Paper'
import { PlayerProps } from './Player';
import Alert from '@mui/material/Alert';
import { postToServer } from '../Client';


const Action = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    fontSize: '2.5em',
}));
type preformActionType = (url: string, body: any) => void

function FlipAction(props: { performAction: preformActionType }) {
    const handleAction = () => { props.performAction('/flip', {}); }
    return (
        <Button onClick={handleAction} variant="contained">Flip</Button>
    );
}

function TakeAction(props: { performAction: preformActionType }) {
    const [takenWord, setTakenWord] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setTakenWord(event.target.value);
    }
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        props.performAction('/take', { takenWord: takenWord });
        setTakenWord('');
    }
    return (
        <form onSubmit={handleSubmit}>
            <TextField id="outlined-basic" label="take" variant="outlined" onChange={handleChange} value={takenWord} />
            <Button type="submit" variant="contained">Take</Button>
        </form>
    );
}

function PlayerSelector(props: { players: PlayerProps[], handleChange: (playerID: number) => void }) {
    const players = props.players.map(player =>
        (<Button onClick={() => props.handleChange(player.playerID)} variant="contained" key={player.playerID}>{player.name}</Button>)
    );
    return (
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            {players}
        </ButtonGroup>
    );
}
function StealAction(props: { performAction: preformActionType, defaultPlayer: number, players: PlayerProps[] }) {
    const [targetPlayer, setTargetPlayer] = useState(props.defaultPlayer);
    const [takenWord, setTakenWord] = useState("")
    const handleSubmit = (event: React.SyntheticEvent) => {
        props.performAction('/steal', { targetPlayer: targetPlayer, takenWord: takenWord });
        setTakenWord('');
        event.preventDefault();
    }
    const handlePlayerChange = (playerID: number) => {
        setTargetPlayer(playerID);
    }
    const handleWordChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setTakenWord(event.target.value);
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <TextField
                    id="outlined-basic"
                    label="steal"
                    variant="outlined"
                    onChange={handleWordChange}
                    value={takenWord} />
                <PlayerSelector players={props.players} handleChange={handlePlayerChange} />
            </div>
            <br />
            <div>
                <Button type="submit" variant="contained">Steal</Button>
            </div>
        </form>
    );
}


export function Actions(props: { gameID: number, playerID: number, defaultPlayerID: number, players: PlayerProps[] }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    function performAction(url: string, body: any) {
        console.log("Performing request to " + url);
        body.playerID = props.playerID;
        body.gameID = props.gameID;
        postToServer('/game' + url, JSON.stringify(body), setErrorMessage);
    }
    const flipAction = <FlipAction performAction={performAction} />;
    const takeAction = <TakeAction performAction={performAction} />;
    const stealAction = <StealAction defaultPlayer={props.defaultPlayerID} players={props.players} performAction={performAction} />;
    const actions = [flipAction, takeAction, stealAction]

    return (<div>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Grid container spacing={8} alignItems="center" justifyContent="center">
            {actions.map((action) =>
                <Grid item key={action.type}>
                    <Action>
                        {action}
                    </Action>
                </Grid>
            )}
        </Grid>
    </div>
    );
}

