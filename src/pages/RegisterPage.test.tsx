import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('redirects platform operators directly to the platform dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/register?type=operator']}>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/platform-dashboard');
    expect(mockGenerateSecretKey).not.toHaveBeenCalled();
    expect(screen.getByText('Weiterleitung zum Plattform-Dashboard…')).toBeInTheDocument();
    expect(screen.queryByText('Ihr Schlüsselpaar')).not.toBeInTheDocument();
  });

  it('shows keypair onboarding for regular users', () => {
    render(
      <MemoryRouter initialEntries={['/register?type=user']}>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(mockGenerateSecretKey).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Ihr Schlüsselpaar')).toBeInTheDocument();
  });
});
