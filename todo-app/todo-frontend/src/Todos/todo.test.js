import {render, screen} from '@testing-library/react';

import Todo from './Todo';

const todo = {
  _id: "649b2c72b826fd1b150664e4",
  text: "Get so much milk",
  done: false,
  __v: 0
  }

test('renders todo', () => {
  render(<Todo todo={todo} />);
  const todoElement = screen.getByText(/Get so much milk/i);
  expect(todoElement).toBeInTheDocument();
});
