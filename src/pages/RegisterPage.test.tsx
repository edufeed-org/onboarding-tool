import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const mockNavigate = vi.fn();
const mockUseCurrentUser = vi.fn();
const mockGenerateSecretKey = vi.fn(() => new Uint8Array(32).fill(1));
const mockGetPublicKey = vi.fn(() => 'pubkey');
const mockNsecEncode = vi.fn(() => 'nsec1test');
const mockNpubEncode = vi.fn(() => 'npub1test');

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

vi.mock('nostr-tools', () => ({
  generateSecretKey: () => mockGenerateSecretKey(),
  getPublicKey: () => mockGetPublicKey(),
  nip19: {
    nsecEncode: () => mockNsecEncode(),
    npubEncode: () => mockNpubEncode(),
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGenerateSecretKey.mockClear();
    mockGetPublicKey.mockClear();
    mockNsecEncode.mockClear();
    mockNpubEncode.mockClear();
    mockUseCurrentUser.mockReturnValue({ user: null });
  });

  it('redirects platform operators directly to the platform dashboard', async () => {
    render(
      <MemoryRouter initialEntries={['/register?type=operator']}>
        <RegisterPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/platform-dashboard');
    });
    expect(mockGenerateSecretKey).not.toHaveBeenCalled();
    expect(screen.getByText(/Weiterleitung zum Plattform-Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Ihr\s*Schlüsselpaar/i })).not.toBeInTheDocument();
  });

  it('shows keypair onboarding for regular users', async () => {
    render(
      <MemoryRouter initialEntries={['/register?type=user']}>
        <RegisterPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockGenerateSecretKey).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole('heading', { name: /Ihr\s*Schlüsselpaar/i })).toBeInTheDocument();
  });
});
