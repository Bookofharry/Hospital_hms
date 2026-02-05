import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Basic smoke test to ensure the app renders the landing page without crashing
it('renders landing page CTA', () => {
  render(
    <MemoryRouter initialEntries={['/landing']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Hospital Maintenance Command Center/i)).toBeInTheDocument();
});
