import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { postToServer } from "../Client";
import "./Login.css";

type setErrorMessageType = React.Dispatch<React.SetStateAction<string>>;
type setGameIDType = React.Dispatch<React.SetStateAction<number | null>>;
type GameCreationProps = { playerID: number, setGameID: setGameIDType, setErrorMessage: setErrorMessageType }

function CreateGameForm(props: GameCreationProps) {
    async function handleSubmit(event: React.SyntheticEvent) {
        props.setErrorMessage('')
        const data = await postToServer('/game/create',
            JSON.stringify({ playerID: props.playerID }),
            props.setErrorMessage)
        if (data) {
            props.setGameID(data.gameID);
        }
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained">Create Game</Button>
        </form>
    );
}
export function JoinGameForm(props: GameCreationProps) {
    const [requestedGameID, setRequestedGameID] = useState('');
    async function handleSubmit(event: React.SyntheticEvent) {
        props.setErrorMessage('')
        const data = await postToServer('/game/' + requestedGameID + '/join',
            JSON.stringify({ playerID: props.playerID }),
            props.setErrorMessage)
        if (data) {
            props.setGameID(data.gameID);
        }
        event.preventDefault();
    }
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setRequestedGameID(event.target.value);
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <TextField id="outlined-basic" label="Game ID" variant="outlined" onChange={handleChange} value={requestedGameID} />
            <Button type="submit" variant="contained">Join Game</Button>
        </form>
    );
}

export function LobbyForm(props: { playerID: number, setGameID: setGameIDType }) {
    const [errorMessage, setErrorMessage] = useState("");
    const gameCreationProps = {
        playerID: props.playerID,
        setGameID: props.setGameID,
        setErrorMessage: setErrorMessage
    }
    return (
        <div>
            <h1>Welcome {props.playerID}</h1>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Grid container spacing={8} alignItems="center" justifyContent="center">
                <Grid item>
                    <JoinGameForm {...gameCreationProps}></JoinGameForm>
                </Grid>
                <Grid item>
                    <CreateGameForm {...gameCreationProps}></CreateGameForm>
                </Grid>
            </Grid>
        </div>)
}