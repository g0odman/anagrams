import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { postToServer } from "../Client";

export function LoginForm(props: { setPlayerID: (playerID: number) => void }) {
    const [playerName, setPlayerName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setErrorMessage('')
        const data = await postToServer('/player/create',
            JSON.stringify({ playerName: playerName }),
            setErrorMessage);
        if (data) {
            localStorage.setItem('playerID', data.playerID);
            props.setPlayerID(data.playerID);
        }
    }
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setPlayerName(event.target.value);
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField id="outlined-basic" label="UserName" variant="outlined" onChange={handleChange} value={playerName} />
            <Button type="submit" variant="contained">Create</Button>
        </form>
    );
}