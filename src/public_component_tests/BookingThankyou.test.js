import { render, screen } from '@testing-library/react';
import BookingThankyou from '../../src/components/common/BookingThankyou';

test('renders booking confirmation message', () => {
  render(<BookingThankyou />);
  expect(screen.getByText(/thank you/i)).toBeInTheDocument();
});
