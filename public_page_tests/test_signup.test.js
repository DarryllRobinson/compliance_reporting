import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../../src/features/users/SignUp';

describe('/signup Page', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText(/./)).toBeInTheDocument();
  });
});
