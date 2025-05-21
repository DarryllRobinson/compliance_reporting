import { render, screen } from '@testing-library/react';
import BlogIndex from '../../src/pages/blog/BlogIndex';

test('renders blog index header', () => {
  render(<BlogIndex />);
  expect(screen.getByText(/blog/i)).toBeInTheDocument();
});
