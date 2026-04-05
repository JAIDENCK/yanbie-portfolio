import { createServerClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/public/Navbar'
import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { DemosSection } from '@/components/public/DemosSection'
import { CharacterRangeSection } from '@/components/public/CharacterRangeSection'
import { ContactSection } from '@/components/public/ContactSection'
import { FloatingSparkles } from '@/components/public/Sparkles'
import type { Profile, Demo, CharacterRange } from '@/lib/types'

export const revalidate = 0 // Always fetch fresh — no caching

const DEFAULT_PROFILE: Profile = {
  id: '1',
  name: 'Yanbie',
  tagline: 'Bringing characters to life, one voice at a time.',
  about:
    "Hi, I'm Yanbie — a voice actress with a passion for storytelling through sound. From tender whispers to fierce battle cries, I love exploring the full emotional spectrum of every role I take on. Let's create something unforgettable together.",
  email: 'hello@yanbie.com',
  photo_url: null,
  socials: {},
}

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch all data fresh from Supabase on every request
  const [profileRes, demosRes, rangesRes] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('demos').select('*').order('order_index', { ascending: true }),
    supabase.from('character_ranges').select('*').order('order_index', { ascending: true }),
  ])

  const profile: Profile = profileRes.data ?? DEFAULT_PROFILE
  const demos: Demo[] = demosRes.data ?? []
  const ranges: CharacterRange[] = rangesRes.data ?? []

  return (
    <main className="relative">
      <FloatingSparkles />
      <Navbar />
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <DemosSection demos={demos} />
      <CharacterRangeSection ranges={ranges} />
      <ContactSection profile={profile} />
    </main>
  )
}
