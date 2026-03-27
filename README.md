# AI Personal Brand OS

A production-ready full-stack SaaS application for building and managing your personal brand with AI-powered tools for content creation, social media management, and brand consistency.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-personal-brand-os.git
   cd ai-personal-brand-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `DATABASE_URL` - PostgreSQL connection string from Supabase
   - `NEXT_PUBLIC_APP_URL` - Your application URL (default: http://localhost:3000)
   - `JWT_SECRET` - Random string for JWT signing

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-personal-brand-os/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Loading state
│   ├── error.tsx          # Error boundary
│   └── not-found.tsx      # 404 page
├── components/             # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Layout components
│   └── ui/                # UI primitives
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configs
├── prisma/                 # Database schema and client
├── services/               # API service functions
├── store/                  # Zustand state stores
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── middleware.ts           # Authentication middleware
└── package.json           # Dependencies and scripts
```

## Features

- 🎨 Modern dark-mode enabled dashboard
- 🔐 Secure authentication with Supabase Auth
- 🎯 Brand management and content scheduling
- 📊 Analytics and performance tracking
- 🤖 AI-powered content generation
- 📱 Fully responsive design

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database Management

- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database
- `npx prisma db pull` - Pull schema from database

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | Your application URL |
| `JWT_SECRET` | Secret for JWT tokens |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js. Make sure to:
1. Set all required environment variables
2. Run database migrations (if using Prisma)
3. Configure proper CORS and security headers

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

Built with ❤️ using Next.js, Supabase, and Prisma