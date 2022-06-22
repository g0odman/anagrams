import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { postToServer } from "../Client";

export function LoginForm(props: { setPlayerID: (playerID: number) => void }) {
    const [playerName, setPlayerName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: React.SyntheticEvent) {
        setErrorMessage('')
        const data = await postToServer('/player/create',
            JSON.stringify({ playerName: playerName }),
            setErrorMessage)
        if (data) {
            localStorage.setItem('playerID', data.playerID);
            props.setPlayerID(data.playerID);
        }
        event.preventDefault();
    }
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setPlayerName(event.target.value);
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField id="outlined-basic" label="take" variant="outlined" onChange={handleChange} value={playerName} />
            <Button type="submit" variant="contained">Take</Button>
        </form>
    );
}