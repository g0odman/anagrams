import { useState } from 'react';

export default function usePlayerID() {
    const getPlayerID = (): number | null => {
        const playerIDString = sessionStorage.getItem('playerID');
        if (!playerIDString) {
            return null;
        }
        const userPlayerID = JSON.parse(playerIDString);
        return userPlayerID?.playerID
    };

    const [playerID, setPlayerID] = useState(getPlayerID());

    const savePlayerID = (playerID: number) => {
        sessionStorage.setItem('playerID', JSON.stringify({ playerID: playerID }));
        setPlayerID(playerID);
    };

    return {
        setPlayerID: savePlayerID,
        playerID
    }
}