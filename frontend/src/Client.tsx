

type setErrorMessageType = (errorMessage: string) => void;

// const targetUrl = 'thawing-spire-40156.herokuapp.com';
const targetUrl = '127.0.0.1:8000';

export async function postToServer(url: string,
    body: string,
    setErrorMessage?: setErrorMessageType): Promise<any> {
    return await fetch('http://' + targetUrl + url, {
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

export function createWebSocket(gameID: number, setErrorMessage?: setErrorMessageType) {
    const url = "ws://" + targetUrl + "/game/" + gameID + "/ws";
    const ws = new WebSocket(url);
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