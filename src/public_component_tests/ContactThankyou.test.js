import { render, screen } from '@testing-library/react';
import ContactThankyou from '../../src/components/common/ContactThankyou';

test('renders contact confirmation', () => {
  render(<ContactThankyou />);
  expect(screen.getByText(/thank you/i)).toBeInTheDocument();
});
