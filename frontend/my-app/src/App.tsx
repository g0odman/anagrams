import './App.css';

import { Actions } from './Anagrams/Actions';
import { PlayerList, PlayerProps } from './Anagrams/Player';
import { GameInfo } from './Anagrams/GameInfo';
import { Board } from './Anagrams/Board';



interface GameProps {
  letters: string[],
  players: PlayerProps[],
}

function Game(props: GameProps) {
  return <div>
    <GameInfo title="Anagrams" remainingLetters={12}></GameInfo>
    <Board letters={props.letters} />
    <PlayerList players={[{ name: "uri", words: ["abc", "bcd"] }]} />
  </div>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game letters={['a', 'b', 'c', 'd', 'e']} players={[]}></Game>
        <Actions />
      </header>
    </div>
  );
}

export default App;
