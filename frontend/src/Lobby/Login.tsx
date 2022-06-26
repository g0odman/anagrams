import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import React, { useState } from "react";
import { postToServer } from "../Client";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

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
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 5 }}>
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField id="outlined-basic"
                    label="UserName"
                    variant="outlined"
                    onChange={handleChange}
                    value={playerName}
                    required
                    fullWidth
                    autoFocus />
                <Button type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}>Create</Button>
                <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Remember me"
                />
            </Box>
            <Copyright sx={{ mt: 4, mb: 4 }} />
        </Box>
    );
}