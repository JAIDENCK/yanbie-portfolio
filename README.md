# Yanbie — Voice Acting Portfolio
## Full Deployment Guide

---

## What This Is

A full Next.js 14 portfolio site for voice actress **Yanbie**, with:
- Beautiful public-facing site with hero, about, demos, character range, and contact sections
- Password-protected admin panel at `/admin`
- Real Supabase backend — edits made in the admin panel are **instantly live for everyone**
- Audio file hosting via Supabase Storage
- Profile photo upload
- Drag-to-reorder for demos and character range cards

---

## Step 1 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — name it `yanbie-portfolio` (or anything)
3. Choose a region close to you, set a strong database password, click Create

### Run the SQL Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run**

This creates:
- `profile` table (your bio, tagline, socials)
- `demos` table (your demo reels)
- `character_ranges` table (your voice range samples)
- `audio` and `images` storage buckets
- All security policies (public read, auth-only write)

### Create the Admin Account

1. Go to **Authentication > Users**
2. Click **Add User > Create New User**
3. Enter Yanbie's email and a strong password
4. This is what you'll use to log in at `/admin`

---

## Step 2 — Get Your API Keys

1. In Supabase, go to **Project Settings > API**
2. Copy your **Project URL** and **anon public** key

---

## Step 3 — Set Up the Project Locally

```bash
# Clone or download this project
cd yanbie-portfolio

# Install dependencies
npm install

# Copy the env example and fill it in
cp .env.local.example .env.local
```

Open `.env.local` and paste your keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Test locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the site.
Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to test the admin panel.

---

## Step 4 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yanbie-portfolio.git
git push -u origin main
```

> ⚠️ Make sure `.env.local` is in your `.gitignore` — it is by default. Never commit your keys.

---

## Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your `yanbie-portfolio` repository
4. Before clicking Deploy, go to **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |

5. Click **Deploy** ✦

Vercel will build and deploy in ~2 minutes. You'll get a URL like `yanbie-portfolio.vercel.app`.

You can add a custom domain in **Vercel > Project > Settings > Domains**.

---

## Step 6 — Using the Admin Panel

1. Go to `yoursite.com/admin/login`
2. Sign in with the email/password you set in Supabase Auth
3. You'll see three tabs:
   - **Profile** — edit your name, tagline, bio, email, socials, and upload a photo
   - **Demos** — add/edit/delete demo reels, drag to reorder
   - **Characters** — add/edit/delete character range samples, drag to reorder
4. Every change saves directly to Supabase
5. Anyone visiting the public site sees your changes immediately — no rebuild needed

---

## Folder Structure

```
/app
  page.tsx                  ← Public homepage (server component, fresh fetch)
  /admin
    page.tsx                ← Admin dashboard
    /login/page.tsx         ← Login page
/components
  /public                   ← All public-facing UI components
    Navbar.tsx
    HeroSection.tsx
    AboutSection.tsx
    AudioPlayer.tsx
    DemosSection.tsx
    CharacterRangeSection.tsx
    ContactSection.tsx
    Sparkles.tsx
  /admin                    ← (inline in admin/page.tsx)
/lib
  supabase.ts               ← Client-side Supabase client
  supabase-server.ts        ← Server-side Supabase client
  types.ts                  ← TypeScript interfaces
/styles
  globals.css               ← Global styles, CSS variables, animations
supabase-schema.sql         ← Full database + storage setup
```

---

## Troubleshooting

**Site shows no content / blank sections**
→ Check your `.env.local` keys are correct and the SQL schema ran without errors

**Admin login says "Invalid login credentials"**
→ Make sure you created the user in Supabase Auth > Users (not just in the database)

**Audio uploads fail**
→ Check storage bucket policies ran correctly in the SQL editor. You can also set them manually in Supabase > Storage > Policies

**Images not showing after deploy**
→ Make sure your Supabase project URL is added to `next.config.js` under `images.remotePatterns` (already done by default)

---

Made with ✦ and lots of tea
