import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';


const Action = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    fontSize: '2.5em',
}));

class FlipAction extends React.Component {
    constructor(props: {}) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log("Flip!");
    }
    render() {
        return (
            <Button onClick={this.handleClick} variant="contained">Flip</Button>
        );
    }
}
class TakeAction extends React.Component<{}, { takenWord: string; }> {
    constructor(props: {}) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            takenWord: ""
        };
    }
    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ takenWord: event.target.value });
        console.log("Changed to: " + this.state.takenWord);
        event.preventDefault();
    }
    handleSubmit(event: React.SyntheticEvent) {
        console.log("Take: " + this.state.takenWord);
        event.preventDefault();

    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={this.handleChange} />
                <Button type="submit" variant="contained">Take</Button>
            </form>
        );
    }
}
class StealAction extends React.Component<{ defaultPlayer: number; }, { targetPlayer: number; takenWord: string; }> {
    constructor(props: { defaultPlayer: number; }) {
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
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={this.handleWordChange} />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button onClick={() => this.handlePlayerChange(0)} variant="contained">One</Button>
                    </ButtonGroup>
                </div>
                <br />
                <div>
                    <Button type="submit" variant="contained">Steal</Button>
                </div>
            </form>
        );
    }
}
export function Actions(props: {}) {
    return (<Grid container spacing={8} alignItems="center" justifyContent="center">
        <Grid item>
            <Action>
                <FlipAction />
            </Action>
        </Grid>
        <Grid item>
            <Action>
                <TakeAction />
            </Action>
        </Grid>
        <Grid item>
            <Action>
                <StealAction defaultPlayer={0} />
            </Action>
        </Grid>
    </Grid>
    );
}

