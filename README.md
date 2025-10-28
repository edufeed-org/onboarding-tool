# Nostr Onboarding with Keycloak Integration

A modern, user-friendly onboarding platform for the Nostr protocol with optional enterprise identity management through Keycloak integration.

## 🌟 Overview

This Next.js application provides a seamless onboarding experience for new Nostr users, guiding them through account creation, profile setup, and secure key management. The platform supports both individual users and organizations with optional Keycloak SSO integration.

## ✨ Features

### Core Onboarding
- **Step-by-step guided flow** for Nostr account creation
- **Educational approach** explaining Nostr concepts
- **Secure key pair generation** with client-side cryptography
- **Multiple backup options** (copy, download, QR codes)
- **Complete profile setup** including photo, bio, and website

### Profile Management
- 📸 **Profile picture upload** with built-in editing
- 👤 **Username and display name** setup
- 📝 **Bio and description** customization
- 🌐 **Website URL** integration
- 🔒 **Privacy controls** for all profile elements

### Security Features
- 🔐 **Client-side key generation** (keys never leave the device)
- 💾 **Multiple backup formats** (encrypted file, QR code, mnemonic)
- 🛡️ **Security education** and best practices
- 📋 **Copy-to-clipboard** with security warnings
- 🔍 **Audit logging** for enterprise compliance

### Enterprise Integration
- 🏢 **Keycloak SSO integration** for organizations
  - Optional synchronization of Nostr private keys (nsec) with Keycloak
  - Secure key storage in distributed signers
  - Environment variable control for enabling/disabling this feature
- 👥 **Bulk user onboarding** capabilities
- 📊 **Analytics and reporting** dashboard
- 🔧 **Role-based access control**
- 📜 **Compliance features** (SOC 2, GDPR ready)

## ⚙️ Keycloak Integration

The Keycloak integration allows users to securely store their Nostr private keys (nsec) with their Keycloak account, providing an additional recovery method while maintaining security.

**Key Security Features:**
- Private keys are encrypted using AES-256-GCM before storage
- Encryption keys never leave the server
- Custom user attributes in Keycloak for secure storage

### Configuration

To enable Keycloak integration:

1. Follow the detailed setup instructions in [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)
2. Set `NEXT_PUBLIC_ENABLE_KEYCLOAK_SYNC=true` 
3. Configure all required environment variables:
   ```
   # Public Keycloak configuration (available in browser)
   NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL=https://your-keycloak-domain/auth
   NEXT_PUBLIC_KEYCLOAK_REALM=nostr-onboarding
   NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=nostr-onboarding-client

   # Server-side Keycloak configuration (not exposed to browser)
   KEYCLOAK_URL=https://your-keycloak-domain/auth
   KEYCLOAK_REALM=nostr-onboarding
   KEYCLOAK_CLIENT_ID=nostr-onboarding-service
   KEYCLOAK_CLIENT_SECRET=your-client-secret

   # Security configuration
   ENCRYPTION_KEY=your-64-character-hex-encryption-key
   ```

When enabled, users will see an additional step in the onboarding process where they can choose to sync their key with Keycloak. This step is entirely optional and can be skipped.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- (Optional) Keycloak server for enterprise features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nostr-onboarding-keycloak.git
   cd nostr-onboarding-keycloak
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables in `.env.local`:
   ```env
   # Nostr Configuration
   NEXT_PUBLIC_DEFAULT_RELAYS=wss://relay.damus.io,wss://nos.lol

   # Keycloak Configuration
   NEXT_PUBLIC_ENABLE_KEYCLOAK_SYNC=true
   NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL=https://your-keycloak-domain/auth
   NEXT_PUBLIC_KEYCLOAK_REALM=nostr-onboarding
   NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=nostr-onboarding-client

   # Server-side Keycloak configuration
   KEYCLOAK_URL=https://your-keycloak-domain/auth
   KEYCLOAK_REALM=nostr-onboarding
   KEYCLOAK_CLIENT_ID=nostr-onboarding-service
   KEYCLOAK_CLIENT_SECRET=your-client-secret

   # Security
   ENCRYPTION_KEY=your-64-character-hex-encryption-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── onboarding/       # Onboarding flow pages
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── onboarding/      # Onboarding-specific components
│   └── profile/         # Profile management components
├── lib/                 # Utility functions
│   ├── nostr.ts        # Nostr protocol utilities
│   ├── crypto.ts       # Cryptographic functions
│   └── keycloak.ts     # Keycloak integration
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run test suite

### Key Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.com/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI components
- **[Nostr Tools](https://github.com/nbd-wtf/nostr-tools)** - Nostr protocol implementation
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication with Keycloak support

## 🔧 Configuration

### Nostr Configuration
Configure default relays and protocol settings in `lib/nostr.ts`:

```typescript
export const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social'
];
```

### Keycloak Setup
1. Create a new client in your Keycloak realm
2. Set the client type to "OpenID Connect"
3. Configure redirect URIs to include your domain
4. Update environment variables with your Keycloak settings

## 📱 User Flow

1. **Welcome Screen** - Introduction to Nostr and the onboarding process
2. **Account Type** - Choose between individual or organization onboarding
3. **Key Generation** - Secure creation of Nostr key pair with education
4. **Profile Setup** - Add display name, bio, profile picture, and website
5. **Security Backup** - Multiple options for backing up private keys
6. **Completion** - Profile preview and next steps recommendations

## 🔒 Security Considerations

- All private keys are generated client-side using Web Crypto API
- Private keys are never transmitted to servers
- Multiple secure backup options are provided
- Educational content emphasizes security best practices
- Enterprise features include audit logging and compliance tools

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 **Documentation**: Check our [Vision Document](VISION.md) for project goals
- 🐛 **Issues**: Report bugs via [GitHub Issues](https://github.com/your-username/nostr-onboarding-keycloak/issues)
- 💬 **Discussions**: Join our [GitHub Discussions](https://github.com/your-username/nostr-onboarding-keycloak/discussions)
- 📧 **Contact**: For enterprise inquiries, contact [your-email@domain.com]

## 🗺️ Roadmap

- [ ] **Phase 1**: Core onboarding flow and basic Keycloak integration
- [ ] **Phase 2**: Advanced profile features and multiple backup methods
- [ ] **Phase 3**: Enterprise dashboard and bulk onboarding
- [ ] **Phase 4**: Client integrations and ecosystem partnerships

## 🙏 Acknowledgments

- The [Nostr Protocol](https://nostr.com/) community for creating an open, decentralized social protocol
- [Keycloak](https://www.keycloak.org/) for enterprise identity management
- All the open-source contributors who make projects like this possible

---

**Made with ❤️ for the decentralized web**
