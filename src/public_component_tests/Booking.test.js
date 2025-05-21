import { render, screen } from '@testing-library/react';
import Booking from '../../src/components/common/Booking';

test('renders booking form fields', () => {
  render(<Booking />);
  expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
});
