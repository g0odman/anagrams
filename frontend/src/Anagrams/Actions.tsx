import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { postToServer } from '../Client';
import { PlayerProps } from './Player';


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

function FlipAction(props: { performAction: preformActionType, disabled: boolean }) {
    const handleAction = () => { props.performAction('/flip', {}); }
    return (
        <Button onClick={handleAction} variant="contained" disabled={props.disabled}>Flip</Button>
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

export function Actions(props: { gameID: number, playerID: number, defaultPlayerID: number, players: PlayerProps[], currentPlayerID: number }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    function performAction(url: string, body: any) {
        console.log("Performing request to " + url);
        body.playerID = props.playerID;
        body.gameID = props.gameID;
        setErrorMessage('');
        postToServer('/game' + url, JSON.stringify(body), setErrorMessage);
    }
    const flipAction = <FlipAction performAction={performAction} disabled={props.currentPlayerID !== props.playerID} />;
    const takeAction = <TakeAction performAction={performAction} />;
    const actions = [flipAction, takeAction]

    return (<div>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
        >
            {actions.map((action) =>
                <Action key={action.type}>
                    {action}
                </Action>
            )}
        </Stack>
    </div>
    );
}

