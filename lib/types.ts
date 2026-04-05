export interface Profile {
  id: string
  name: string
  tagline: string
  about: string
  email: string
  photo_url: string | null
  socials: {
    twitter?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    casting_call_club?: string
    voices_com?: string
  }
}

export interface Demo {
  id: string
  title: string
  tag: string
  audio_url: string
  order_index: number
  created_at: string
}

export interface CharacterRange {
  id: string
  label: string
  description: string
  audio_url: string
  order_index: number
}
