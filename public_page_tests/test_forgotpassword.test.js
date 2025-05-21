import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../../src/features/users/ForgotPassword';

describe('/forgot-password Page', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    expect(screen.getByText(/./)).toBeInTheDocument();
  });
});
