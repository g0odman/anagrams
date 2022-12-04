

type setErrorMessageType = (errorMessage: string) => void;

// const targetUrl = 'thawing-spire-40156.herokuapp.com';
const targetUrl = 'localhost:8000';

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

export function createWebSocket(gameID: number) {
    const url = "ws://" + targetUrl + "/game/" + gameID + "/ws";
    const ws = new WebSocket(url);
    return ws;
}