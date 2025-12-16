import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders title and restart button', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
});

test('clicking places marks and toggles turn', () => {
  render(<App />);
  const cells = screen.getAllByRole('gridcell');
  // First move X
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
  // Second move O
  fireEvent.click(cells[1]);
  expect(cells[1]).toHaveTextContent('O');
});

test('restart clears the board', () => {
  render(<App />);
  const cells = screen.getAllByRole('gridcell');
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
  fireEvent.click(screen.getByRole('button', { name: /restart/i }));
  cells.forEach((c) => expect(c).toHaveTextContent(''));
});
