import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const mockNavigate = vi.fn();
const mockUseCurrentUser = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@unhead/react', () => ({
  useSeoMeta: vi.fn(),
}));

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

vi.mock('@/hooks/useLoginActions', () => ({
  useLoginActions: () => ({ nsec: vi.fn() }),
}));

vi.mock('@/components/PageHeader', () => ({
  PageHeader: () => <div data-testid="page-header" />,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseCurrentUser.mockReturnValue({ user: null });
  });

  it('redirects platform operators directly to the platform dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/register?type=operator']}>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/platform-dashboard');
    expect(screen.queryByText('Ihr Schlüsselpaar')).not.toBeInTheDocument();
  });

  it('shows keypair onboarding for regular users', () => {
    render(
      <MemoryRouter initialEntries={['/register?type=user']}>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Ihr Schlüsselpaar')).toBeInTheDocument();
  });
});
