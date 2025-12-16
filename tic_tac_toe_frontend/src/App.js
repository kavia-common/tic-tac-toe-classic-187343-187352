import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Compute winner for a 3x3 board array of 9 elements.
 * Returns 'X' | 'O' if a winner is found, otherwise null.
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Cols
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonals
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * Board state: array of 9 cells with 'X' | 'O' | null
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const currentPlayer = xIsNext ? 'X' : 'O';

  // Compute game status
  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => board.every(Boolean) && !winner, [board, winner]);
  const gameOver = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    /**
     * Handles a user clicking a cell:
     * - Ignores clicks if the game is over or the cell is already filled.
     * - Sets the current player's mark and toggles turn.
     */
    if (gameOver || board[index]) return;
    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleKeyDown = (event, index) => {
    /**
     * Accessibility: allow using Enter/Space to activate a cell.
     */
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCellClick(index);
    }
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /**
     * Resets the board and state to initial values.
     */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? 'It’s a draw!'
      : `Turn: ${currentPlayer}`;

  const statusBadgeClass = winner ? 'badge badge-win' : isDraw ? 'badge badge-draw' : 'badge';

  return (
    <main className="App" role="main">
      <section className="app-card" aria-labelledby="title">
        <header className="header">
          <h1 id="title" className="title">Tic Tac Toe</h1>
          <p className="subtitle">Two players. One device. Classic fun.</p>
        </header>

        <div className="status-bar" aria-live="polite" aria-atomic="true">
          {!gameOver && <span className="status-dot" aria-hidden="true" />}
          <span className="status-text">{statusText}</span>
          {winner && <span className={statusBadgeClass} aria-label="Game won">Winner</span>}
          {isDraw && !winner && <span className={statusBadgeClass} aria-label="Game draw">Draw</span>}
        </div>

        <Board
          board={board}
          onCellClick={handleCellClick}
          onCellKeyDown={handleKeyDown}
          disabled={gameOver}
        />

        <div className="controls">
          <button
            type="button"
            className="btn btn-primary"
            onClick={resetGame}
            aria-label="Restart game"
          >
            Restart
          </button>
        </div>
      </section>
    </main>
  );
}

function Board({ board, onCellClick, onCellKeyDown, disabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {board.map((value, idx) => (
        <Cell
          key={idx}
          index={idx}
          value={value}
          onClick={() => onCellClick(idx)}
          onKeyDown={(e) => onCellKeyDown(e, idx)}
          disabled={disabled || Boolean(value)}
        />
      ))}
    </div>
  );
}

function Cell({ value, onClick, onKeyDown, disabled, index }) {
  const label = value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`;
  return (
    <button
      type="button"
      className={`cell${disabled ? ' disabled' : ''}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      aria-label={label}
      role="gridcell"
    >
      <span className={`mark ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`} aria-hidden="true">
        {value || ''}
      </span>
      <span className="visually-hidden">{label}</span>
    </button>
  );
}
