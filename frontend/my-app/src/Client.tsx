import './App.css';

type setterFunction = (stateType: any) => void;
type setErrorMessageType = (errorMessage: string) => void;

export async function fetchGameData(url: string,
    body: string,
    setErrorMessage: setErrorMessageType,
    setResponse: setterFunction) {
    fetch("http://localhost:8000/" + url).then(async response => {
        const data = await response.json()

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response statusText
            setErrorMessage((data && data.message) || response.statusText);
        } else {
            setResponse(data);
        }
    });
}