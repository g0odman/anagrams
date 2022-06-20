import React from 'react';

export function GameInfo(props: { title: string; remainingLetters: number; }) {
  return (
    <div>
      <h1>{props.title}</h1>
      <h2>Remaining letters count: {props.remainingLetters}</h2>
    </div>
  );
}
