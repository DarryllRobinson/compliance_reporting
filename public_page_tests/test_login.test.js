import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../src/features/users/Login';

describe('/login Page', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/./)).toBeInTheDocument(); // Replace with better matcher
  });
});
