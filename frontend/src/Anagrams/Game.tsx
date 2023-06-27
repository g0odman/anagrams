import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { Actions } from "./Actions";
import { Board, OrderedLetterProps } from "./Board";
import { GameInfo } from "./GameInfo";
import { PlayerList, PlayerProps } from "./Player";
import { createWebSocket } from "../Client";

type GameData = {
    letters: OrderedLetterProps[],
    players: PlayerProps[],
    remainingLetters: number,
    currentPlayerID: number,
    defaultPlayerID: number
}

function RunningGame(props: { gameData: GameData, gameID: number }) {
    return <Container>
        <GameInfo
            gameID={props.gameID}
            remainingLetters={props.gameData.remainingLetters}
            currentPlayerID={props.gameData.currentPlayerID}
            players={props.gameData.players} />
        <Board letters={props.gameData.letters} />
        <PlayerList players={props.gameData.players} />
    </Container>;
}
export function Game(props: { playerID: number, gameID: number }) {
    const [errorMessage] = useState("");
    const [gameData, setGameData] = useState({
        letters: [],
        players: [],
        remainingLetters: 0,
        currentPlayerID: 0,
        defaultPlayerID: 0
    });
    useEffect(() => {
        const ws = createWebSocket(props.gameID);

        // recieve message every start page
        ws.onmessage = (e) => {
            const receivedGameData = JSON.parse(e.data);
            setGameData(receivedGameData);
        };

        //clean up function when we close page
        return () => ws.close();
    }, [props.gameID]);

    if (!errorMessage) {
        return (

            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                }}
            >
                <Container maxWidth="lg">
                    <RunningGame gameData={gameData} gameID={props.gameID}></RunningGame >
                    <Actions players={gameData.players} defaultPlayerID={gameData.defaultPlayerID} gameID={props.gameID} playerID={props.playerID} currentPlayerID={gameData.currentPlayerID} />
                </Container>
            </Box>
        );
    } else {
        return (<Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            This is an error alert — <strong>{errorMessage}</strong>
        </Alert>);
    }
}
