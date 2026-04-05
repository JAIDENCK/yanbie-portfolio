'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { SparkleIcon } from './Sparkles'
import type { Profile } from '@/lib/types'

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3 rounded-2xl font-body font-700 text-sm transition-all hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.15)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        color: 'white',
        fontWeight: 700,
        backdropFilter: 'blur(8px)',
      }}
    >
      {icon}
      {label}
    </a>
  )
}

export function ContactSection({ profile }: { profile: Profile }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const socials = profile.socials || {}

  return (
    <section
      id="contact"
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #D85F7E 0%, #B93360 60%, #8B1A4A 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 animate-float-slow"
        style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 animate-float"
        style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-30%, 30%)', animationDelay: '2s' }} />

      {/* Sparkles */}
      <div className="absolute top-12 left-12 animate-float-slow"><SparkleIcon size={20} color="rgba(255,255,255,0.4)" /></div>
      <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '1s' }}><SparkleIcon size={14} color="rgba(253,199,125,0.6)" /></div>
      <div className="absolute bottom-20 left-1/3 animate-float-fast" style={{ animationDelay: '0.5s' }}><SparkleIcon size={10} color="rgba(255,255,255,0.3)" /></div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <div className="mb-6">
            <SparkleIcon size={32} color="#FDC77D" />
          </div>
          <p
            className="font-body text-sm font-700 tracking-widest uppercase mb-4"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            ✦ Let's Work Together ✦
          </p>
          <h2
            className="font-display font-900 mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: 'white', lineHeight: 1.1 }}
          >
            Book My Voice
          </h2>
          <p
            className="font-body text-lg mb-10"
            style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontWeight: 500 }}
          >
            Whether it's a character, commercial, narration, or something totally unique —
            I'd love to bring your project to life.
          </p>

          {/* Email CTA */}
          {profile.email && (
            <motion.a
              href={`mailto:${profile.email}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body font-700 text-lg mb-10 transition-all hover:-translate-y-1"
              style={{
                background: 'white',
                color: '#B93360',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7 L12 13 L22 7" />
              </svg>
              {profile.email}
            </motion.a>
          )}

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {socials.twitter && (
              <SocialLink href={socials.twitter} label="Twitter / X" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.767 5.45-5.767zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              } />
            )}
            {socials.instagram && (
              <SocialLink href={socials.instagram} label="Instagram" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              } />
            )}
            {socials.tiktok && (
              <SocialLink href={socials.tiktok} label="TikTok" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.27 8.27 0 004.83 1.54V6.84a4.85 4.85 0 01-1.06-.15z"/>
                </svg>
              } />
            )}
            {socials.youtube && (
              <SocialLink href={socials.youtube} label="YouTube" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              } />
            )}
            {socials.casting_call_club && (
              <SocialLink href={socials.casting_call_club} label="Casting Call Club" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12 L16 12 M12 8 L12 16" />
                </svg>
              } />
            )}
            {socials.voices_com && (
              <SocialLink href={socials.voices_com} label="Voices.com" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              } />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-20 pb-4">
        <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          © {new Date().getFullYear()} Yanbie · Made with ✦ and lots of tea
        </p>
      </div>
    </section>
  )
}
