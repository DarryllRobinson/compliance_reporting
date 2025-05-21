import { render, screen } from '@testing-library/react';
import PublicComplianceNavigator from '../../src/components/common/PublicComplianceNavigator';

test('renders compliance navigator', () => {
  render(<PublicComplianceNavigator />);
  expect(screen.getByText(/navigator/i)).toBeInTheDocument();
});
