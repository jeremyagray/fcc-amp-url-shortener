import { render, screen } from '@testing-library/react';
import URLShortener from './URLShortener';

test('renders main headline', () => {
  render(<URLShortener />);
  const h1 = screen.getByText(/url shortener/i);
  expect(h1).toBeInTheDocument();
});

test('renders form title', () => {
  render(<URLShortener />);
  const h2 = screen.getByText(/create url/i);
  expect(h2).toBeInTheDocument();
});

test('renders form button', () => {
  render(<URLShortener />);
  const h2 = screen.getByRole('button', {'name': /create/i});
  expect(h2).toBeInTheDocument();
});

test('renders list title', () => {
  render(<URLShortener />);
  const h2 = screen.getByText(/links/i);
  expect(h2).toBeInTheDocument();
});
