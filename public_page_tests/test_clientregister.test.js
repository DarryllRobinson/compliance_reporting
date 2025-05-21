import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ClientRegister from '../../src/features/clients/ClientRegister';

describe('/register-client Page', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ClientRegister />
      </MemoryRouter>
    );
    expect(screen.getByText(/./)).toBeInTheDocument();
  });
});
