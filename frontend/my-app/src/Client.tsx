

type setErrorMessageType = (errorMessage: string) => void;

export async function postToServer(url: string,
    body: string,
    setErrorMessage?: setErrorMessageType): Promise<any> {
    return await fetch("http://localhost:8000" + url, {
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