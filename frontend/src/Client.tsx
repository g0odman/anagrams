import { config } from "./Constants";


type setErrorMessageType = (errorMessage: string) => void;
const apiUrl = config.url.API_URL;
const apiHost = config.url.API_HOST;

export async function postToServer(url: string,
    body: string,
    setErrorMessage?: setErrorMessageType): Promise<any> {
    return await fetch(apiUrl + "/api" + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
    }).then(async response => {
        const data = await response.json()

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response statusText
            setErrorMessage?.((data && data.message) || response.statusText);
            return null;
        }
        return data;
    }
    )
}

function getUrlForWebSocket(gameID: number) {
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const host = apiHost ? apiHost : window.location.host;

    return protocol + host + "/api/game/" + gameID + "/ws";
}
export function createWebSocket(gameID: number, setErrorMessage?: setErrorMessageType) {
    const ws = new WebSocket(getUrlForWebSocket(gameID));
    const waitForConnection = (): Promise<void> => {
        return new Promise((resolve) => {
            if (ws.readyState === WebSocket.OPEN) {
                resolve();
            } else {
                ws.onopen = resolve as () => void;
            }
        });
    };
    ws.onerror = function (event) {
        console.log("WebSocket error observed:", event);
        setErrorMessage?.("WebSocket error observed: " + event);
    };

    ws.onclose = function (event) {
        if (!event.wasClean) {
            console.error('WebSocket connection abruptly closed');
            setErrorMessage?.("WebSocket connection abruptly closed" + event.code + " " + event.reason);
        } else {
            console.log("WebSocket closed cleanly");
        }
    }
    const initializeWebSocket = async () => {
        await waitForConnection();
        setErrorMessage?.("");
        console.log("WebSocket connection established");
        // Proceed with further actions or state updates once the WebSocket connection is established
    };

    initializeWebSocket();

    return ws;
}