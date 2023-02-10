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
    if (!xIsMaxed && squares[i])  // If we are still filling blank squares and we chose a non-blank
      return
    if (transferring && squares[i])  // If we are transferring and we choose a non-blank
      return
    if (xIsMaxed && !transferring && ((xIsNext && squares[i] != 'X') || !xIsNext && squares[i] != 'O'))
      return

    let j;
    for (let k = 0; k < 9; k++) 
      if (squares[k] == '?') 
        j = k;
    if (transferring && !isAdjacent(j + 1, i + 1))
      return

    const nextSquares = squares.slice()
    if (xIsMaxed) {
      if (!transferring) {  // Fill old spot with '?'
        nextSquares[i] = '?'
        setTransferring(true)
      }
      else {  // Set 'X' or 'O' in new spot and remove the '?'
        setTransferring(false)  
        nextSquares[i] = (xIsNext ? 'X' : 'O')
        for (let k = 0; k < 9; k++) 
          if (nextSquares[k] == '?') 
            nextSquares[k] = null
      }
    }
    else {  // Do regular tic-tac-toe
      if (xIsNext)
        nextSquares[i] = 'X'
      else
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
    if (currentMove >= 5) {
      setXIsMaxed(true)
    }
    else 
      setXIsMaxed(false)
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
    if (nextMove < 6) {
      setTransferring(false)
      setXIsMaxed(false)
      setXIsNext(nextMove % 2 === 0);
    }
    else 
      setTransferring(nextMove % 2 === 1)
      setXIsMaxed(true)
      setXIsNext(Math.floor(nextMove / 2) % 2 === 1);
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

function isAdjacent(orgin, dest) {
  switch(orgin) {
    case 1: 
      if (dest == 2 || dest == 4 || dest == 5)
        return true
      else  
        return false
    case 2: 
      if (dest == 1 || dest == 3 || dest == 4 || dest == 5 || dest == 6)
        return true
      else  
        return false
    case 3: 
      if (dest == 2 || dest == 5 || dest == 6)
        return true
      else  
        return false
    case 4: 
    if (dest == 1 || dest == 2 || dest == 5 || dest == 7 || dest == 8)
      return true
    else  
      return false
    case 5: return true
    case 6: 
      if (dest == 2 || dest == 3 || dest == 5 || dest == 8 || dest == 9)
        return true
      else  
        return false
    case 7: 
      if (dest == 4 || dest == 5 || dest == 8)
        return true
      else  
        return false
    case 8: 
      if (dest == 4 || dest == 5 || dest == 6 || dest == 7 || dest == 9)
        return true
      else  
        return false
    case 9: 
      if (dest == 5 || dest == 6 || dest == 8)
        return true
      else  
        return false
  }

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