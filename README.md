# Kaitif Skatepark App

The ultimate digital hub for Barbados' premier skatepark - combining park operations with social features to build an engaged skating community.

## Features

- **Digital Park Passes** - Apple Wallet & Google Wallet integration with QR scanning
- **Event Management** - Competitions, lessons, jams, and meetups with RSVP
- **Challenge Centre** - Trick challenges with video verification, XP, badges, and leaderboards
- **P2P Marketplace** - Buy and sell gear within the community
- **Instant Messaging** - Real-time DMs, group chats, and announcements
- **Waiver System** - Digital signature capture with PDF generation

## Tech Stack

### Frontend
- **Web**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Mobile**: React Native (Expo), NativeWind

### Backend
- **API**: tRPC with end-to-end type safety
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (Google, Apple, Magic Links)
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

### Payments
- **Stripe** for pass purchases and marketplace transactions
- **Stripe Connect** for P2P payouts

## Project Structure

```
kaitif/
├── apps/
│   ├── web/        # Next.js web application
│   ├── mobile/     # React Native (Expo) app
│   └── admin/      # Admin dashboard
├── packages/
│   ├── api/        # tRPC API routes
│   ├── db/         # Prisma schema & client
│   ├── ui/         # Shared UI components
│   └── utils/      # Shared utilities
├── supabase/       # Supabase configuration
└── docs/           # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker (for local Supabase)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaitif/kaitif-app.git
   cd kaitif
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment files:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Start Supabase locally:
   ```bash
   pnpm supabase start
   ```

5. Generate Prisma client:
   ```bash
   pnpm db:generate
   ```

6. Push database schema:
   ```bash
   pnpm db:push
   ```

7. Start development servers:
   ```bash
   pnpm dev
   ```

### URLs

- **Web App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Supabase Studio**: http://localhost:54323

## Environment Variables

### Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Optional

```env
# Apple Wallet
APPLE_TEAM_ID=
APPLE_PASS_TYPE_IDENTIFIER=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Apple OAuth
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

## Development

### Commands

```bash
# Start all dev servers
pnpm dev

# Build all apps
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint

# Database commands
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Prisma Studio
```

## Deployment

### Web App (Vercel)

1. Connect your repository to Vercel
2. Set environment variables
3. Deploy

### Mobile App (Expo EAS)

```bash
cd apps/mobile
eas build --platform all
eas submit
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Copyright © 2024 Kaitif Skatepark, Barbados. All rights reserved.
