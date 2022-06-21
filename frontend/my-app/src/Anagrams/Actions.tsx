import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import styled from '@mui/material/styles/styled';
import Paper from '@mui/material/Paper'
import { PlayerProps } from './Player';
import Alert from '@mui/material/Alert';


const Action = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    fontSize: '2.5em',
}));
type preformActionType = (url: string, body: string) => void
class FlipAction extends React.Component<{ performAction: preformActionType }> {
    constructor(props: { performAction: preformActionType }) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.performAction('flip', '');
    }
    render() {
        return (
            <Button onClick={this.handleClick} variant="contained">Flip</Button>
        );
    }
}
class TakeAction extends React.Component<{ performAction: preformActionType }, { takenWord: string; }> {
    constructor(props: { performAction: preformActionType }) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            takenWord: ""
        };
    }
    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ takenWord: event.target.value });
        event.preventDefault();
    }
    handleSubmit(event: React.SyntheticEvent) {
        console.log("Take: " + this.state.takenWord);
        this.props.performAction('take', JSON.stringify(this.state));
        this.setState({ takenWord: "" });
        event.preventDefault();

    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField id="outlined-basic" label="take" variant="outlined" onChange={this.handleChange} value={this.state.takenWord} />
                <Button type="submit" variant="contained">Take</Button>
            </form>
        );
    }
}
function PlayerSelector(props: { players: PlayerProps[], handleChange: (playerID: number) => void }) {
    const players = props.players.map(player =>
        (<Button onClick={() => props.handleChange(player.playerID)} variant="contained" key={player.playerID}>{player.name}</Button>)
    );
    return (
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            {players}
        </ButtonGroup>
    );
}
class StealAction extends React.Component<{ performAction: preformActionType, defaultPlayer: number, players: PlayerProps[]; }, { targetPlayer: number; takenWord: string; }> {
    constructor(props: { performAction: preformActionType, defaultPlayer: number; players: PlayerProps[] }) {
        super(props);
        this.state = {
            targetPlayer: props.defaultPlayer,
            takenWord: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePlayerChange = this.handlePlayerChange.bind(this);
        this.handleWordChange = this.handleWordChange.bind(this);
    }
    handleSubmit(event: React.SyntheticEvent) {
        console.log("Stealing " + this.state.takenWord + " from " + this.state.targetPlayer);
        this.props.performAction('steal', JSON.stringify(this.state));
        this.setState({ takenWord: "" });
        event.preventDefault();
    }
    handlePlayerChange(playerID: number) {
        console.log("Moved player to: " + playerID);
        this.setState({ targetPlayer: +playerID });
    }
    handleWordChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        console.log("Changed word to: " + event.target.value);
        this.setState({ takenWord: event.target.value });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <TextField
                        id="outlined-basic"
                        label="steal"
                        variant="outlined"
                        onChange={this.handleWordChange}
                        value={this.state.takenWord} />
                    <PlayerSelector players={this.props.players} handleChange={this.handlePlayerChange} />
                </div>
                <br />
                <div>
                    <Button type="submit" variant="contained">Steal</Button>
                </div>
            </form>
        );
    }
}

export function Actions(props: { gameID: number, defaultPlayerID: number, players: PlayerProps[] }) {
    const [errorMessage, seterrorMessage] = useState(null);
    function performAction(url: string, body: string) {
        console.log("Performing request to " + url)
        fetch("http://localhost:8000/game/" + props.gameID + "/" + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        }).then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                seterrorMessage((data && data.message) || response.statusText);
            }

        });
    }
    const flipAction = <FlipAction performAction={performAction} />;
    const takeAction = <TakeAction performAction={performAction} />;
    const stealAction = <StealAction defaultPlayer={props.defaultPlayerID} players={props.players} performAction={performAction} />;
    const actions = [flipAction, takeAction, stealAction]

    return (<div>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Grid container spacing={8} alignItems="center" justifyContent="center">
            {actions.map((action) =>
                <Grid item key={action.type}>
                    <Action>
                        {action}
                    </Action>
                </Grid>
            )}
        </Grid>
    </div>
    );
}

