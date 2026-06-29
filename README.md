# Job Hunt Dashboard

AI-scored job pipeline dashboard built with Next.js. Browse, filter, bookmark, apply, and reject jobs synced from Supabase by your n8n workflow.

## Stack

- Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui
- Supabase · TanStack Table · date-fns

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your Supabase project URL and anon key.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |

## Deploy

Deploy to [Vercel](https://vercel.com) and add the same environment variables in the project settings.
