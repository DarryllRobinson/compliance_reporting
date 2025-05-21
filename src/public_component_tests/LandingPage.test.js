import { render, screen } from '@testing-library/react';
import LandingPage from '../../src/pages/LandingPage';

test('renders landing headline', () => {
  render(<LandingPage />);
  expect(screen.getByText(/payment times reporting/i)).toBeInTheDocument();
});
