import { useState } from 'react';
import { postToServer } from '../Client';
export async function getPlayerName(playerID: number): Promise<string | null> {
    const data = await postToServer('/player/' + playerID + '/name', '');
    if (data) {
        return data.playerName;
    }
    return null;
}

// This is becuase the DB is non-persistent...
async function doesPlayerIDExist(playerID: number) {
    const playerName = await getPlayerName(playerID);
    return playerName !== null;

}
async function removePlayerIfInvalid(playerID: number | null, setPlayerID: React.Dispatch<React.SetStateAction<number | null>>) {
    if (!playerID) {
        return;
    }
    const doesPlayerExist = await doesPlayerIDExist(playerID);
    if (!doesPlayerExist) {
        sessionStorage.removeItem('playerID');
        setPlayerID(null);
    }
}
export function usePlayerID() {
    const getPlayerID = (): number | null => {
        const playerIDString = sessionStorage.getItem('playerID');
        if (!playerIDString) {
            return null;
        }
        const playerID = JSON.parse(playerIDString)?.playerID;
        if (!playerID) {
            return null;
        }
        if (!getPlayerName(playerID)) {
            sessionStorage.removeItem('playerID');
            return null;
        }
        return playerID;
    };

    const [playerID, setPlayerID] = useState(getPlayerID());

    const savePlayerID = (playerID: number) => {
        sessionStorage.setItem('playerID', JSON.stringify({ playerID: playerID }));
        setPlayerID(playerID);
    };
    removePlayerIfInvalid(playerID, setPlayerID);

    return {
        setPlayerID: savePlayerID,
        playerID
    }
}

export async function getGameID(playerID: number): Promise<number | null> {
    const data = await postToServer('/player/' + playerID + '/game', '');
    if (data) {
        return data.gameID;
    }
    return null;
}
