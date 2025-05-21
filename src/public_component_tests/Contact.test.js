import { render, screen } from '@testing-library/react';
import Contact from '../../src/components/common/Contact';

test('renders contact form fields', () => {
  render(<Contact />);
  expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
});
