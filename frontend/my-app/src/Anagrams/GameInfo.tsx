import React from 'react';

export function GameInfo(props: { title: string, remainingLetters: number, currentPlayerID: number }) {
  return (
    <div>
      <h1>{props.title}</h1>
      <h2>Remaining letters count: {props.remainingLetters}</h2>
      <h2>Next turn: {props.currentPlayerID}</h2>
    </div>
  );
}
