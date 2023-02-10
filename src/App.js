import React from "react"
import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square"
      onClick = {onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsMaxed, transferring, xIsNext, squares, onPlay, setTransferring }) {
  const winner = calculateWinner(squares)
  let status
  if (winner) 
    status = "Winner: " + winner
  else 
    status = "Next player: " + (xIsNext ? "X" : "O") + "Maxed?: " + (xIsMaxed ? "Maxed" : "Nah") + "T?" + (transferring ? "Y": "N")

  function handleClick(i) {
    if (calculateWinner(squares))
      return
    if (!xIsMaxed && squares[i] && !transferring)  // If we are still filling blank squares and we chose a non-blank
      return
    if (xIsNext && transferring && squares[i])  // If we are transferring and we choose a non-blank (TODO)
      return
    const nextSquares = squares.slice()
    // if (xIsNext && xIsMaxed && !transferring) { // If squares is maxed out, select which one to switch
    //   nextSquares[i] = '?'
    //   setTransferring(true)
    // }
    // else if (xIsNext && xIsMaxed && transferring) {  // switch it
    //   setTransferring(false)
    //   nextSquares[i] = 'X'
    //   for (let i = 0; i < 9; i++) {
    //     if (nextSquares[i] == '?') {
    //       nextSquares[i] = null
    //     }
    //   }
    // }
    if (xIsMaxed && !transferring) {
      nextSquares[i] = '?'
      setTransferring(true)
    }
    else if (xIsMaxed && transferring) {
      setTransferring(false)
      nextSquares[i] = (xIsNext ? 'X' : 'O')
      for (let i = 0; i < 9; i++) {
        if (nextSquares[i] == '?') {
          nextSquares[i] = null
        }
      }
    }
    else if (xIsNext) {
      nextSquares[i] = 'X'
    }
    else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value = {squares[0]} onSquareClick = {() => handleClick(0)} />
        <Square value = {squares[1]} onSquareClick = {() => handleClick(1)} />
        <Square value = {squares[2]} onSquareClick = {() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value = {squares[3]} onSquareClick = {() => handleClick(3)} />
        <Square value = {squares[4]} onSquareClick = {() => handleClick(4)} />
        <Square value = {squares[5]} onSquareClick = {() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value = {squares[6]} onSquareClick = {() => handleClick(6)} />
        <Square value = {squares[7]} onSquareClick = {() => handleClick(7)} />
        <Square value = {squares[8]} onSquareClick = {() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const currentSquares = history[currentMove];

  // Nathan Code
  const [xIsMaxed, setXIsMaxed] = useState(false);
  const [transferring, setTransferring] = useState(false);

  function handlePlay(nextSquares) {
    if (currentMove > 4) {
      setXIsMaxed(true)
    }
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    for (let i = 0; i < 9; i++) {
      if (nextSquares[i] == '?') {
        return
      }
    }
    setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {

    let description;
    if (move > 0) 
      description = 'Go to move #' + move
    else  
      description = 'Go to game start'
    return (
      <li key = {move}>
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsMaxed = {xIsMaxed} transferring = {transferring} xIsNext = {xIsNext} squares = {currentSquares} onPlay = {handlePlay} setTransferring = {setTransferring} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}