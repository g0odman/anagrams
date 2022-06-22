import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { postToServer } from "../Client";
import { getPlayerName } from "./useToken";

type setErrorMessageType = React.Dispatch<React.SetStateAction<string>>;
type setGameIDType = React.Dispatch<React.SetStateAction<number | null>>;
type GameCreationProps = { playerID: number, setGameID: setGameIDType, setErrorMessage: setErrorMessageType }

function CreateGameForm(props: GameCreationProps) {
    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        props.setErrorMessage('')
        const data = await postToServer('/game/create',
            JSON.stringify({ playerID: props.playerID }),
            props.setErrorMessage)

        if (data) {
            props.setGameID(data.gameID);
        }
    }
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Create A New Game
                    </Typography>
                    <Typography>
                        If your are the first of your friends to arrive here. Initiate the game and
                        anticipate their arrival
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button type="submit" variant="contained">Create</Button>
                </CardActions>
            </Card>

        </Box>
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Join an Existing Game
                    </Typography>
                    <Typography>
                        Join a game which someone else has begun. Be prepared for what awaits you
                        there.
                    </Typography>
                    <TextField id="outlined-basic" label="Game ID" variant="outlined" onChange={handleChange} value={requestedGameID} />
                </CardContent>
                <CardActions>
                    <Button type="submit" variant="contained">Join Game</Button>
                </CardActions>
            </Card>
        </Box>
    );
}
function WelcomeMessage(props: { playerID: number }) {
    const [playerName, setPlayerName] = useState(props.playerID.toString());
    (async () => {
        const receivedPlayerName = await getPlayerName(props.playerID)
        if (receivedPlayerName) {
            setPlayerName(receivedPlayerName);
        }
    })()
    return <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
    >Welcome {playerName}</Typography>;
}
export function LobbyForm(props: { playerID: number, setGameID: setGameIDType }) {
    const [errorMessage, setErrorMessage] = useState("");
    const gameCreationProps = {
        playerID: props.playerID,
        setGameID: props.setGameID,
        setErrorMessage: setErrorMessage
    }
    return (

        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            <Container maxWidth="sm">

                <WelcomeMessage playerID={props.playerID}></WelcomeMessage>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    Welcome to the magical game of Anagrams, in this game you will discover more
                    yourself and your friends than ever in the past. Prepare to embark on a journey
                    into the unknown. Immerse yourself in what seems like a simple word game but
                    may just decide your fate...
                </Typography>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <JoinGameForm {...gameCreationProps}></JoinGameForm>

                    <CreateGameForm {...gameCreationProps}></CreateGameForm>
                </Stack>
            </Container>
        </Box >)
}