'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { SparkleIcon, StarIcon, HeartIcon } from './Sparkles'
import type { Profile } from '@/lib/types'

// Kawaii floating emojis around the photo
const ORBIT_STICKERS = ['🎙️', '✨', '🌸', '💖', '🎶']

export function HeroSection({ profile }: { profile: Profile }) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FFF3CB 0%, #FFF095 25%, #FDC77D 50%, #FF9C7F 72%, #FD7E85 88%, #D85F7E 100%)',
      }}
    >
      {/* Big soft background blobs */}
      <div className="absolute top-[-120px] right-[-120px] w-[600px] h-[600px] rounded-full opacity-15 animate-float-slow"
        style={{ background: 'radial-gradient(circle, #B93360 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-[450px] h-[450px] rounded-full opacity-12 animate-float"
        style={{ background: 'radial-gradient(circle, #D85F7E 0%, transparent 70%)', animationDelay: '3s' }} />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full opacity-10 animate-drift"
        style={{ background: 'radial-gradient(circle, #FFF095 0%, transparent 70%)' }} />

      {/* Scattered kawaii stickers in background */}
      {['🌸', '⭐', '💫', '🎀', '✨', '🌟', '💕', '🎵'].map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl select-none pointer-events-none animate-drift"
          style={{
            top: `${10 + (i * 11) % 80}%`,
            left: `${5 + (i * 13) % 88}%`,
            opacity: 0.18,
            animationDelay: `${i * 0.7}s`,
            fontSize: `${1.2 + (i % 3) * 0.4}rem`,
          }}
        >
          {emoji}
        </div>
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">

        {/* ── Text side ── */}
        <div>
          {/* Cute badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(255,255,255,0.5)',
              border: '2px solid rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(185,51,96,0.15)',
            }}
          >
            <span className="animate-heartbeat">🎙️</span>
            <span className="font-body font-700 text-sm" style={{ color: '#B93360', letterSpacing: '0.12em' }}>
              VOICE ACTRESS
            </span>
            <span className="animate-wiggle">✨</span>
          </motion.div>

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="yanbie-wordmark font-display mb-5"
            style={{
              fontSize: 'clamp(5rem, 14vw, 9.5rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            {profile.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="font-body text-xl mb-8 leading-relaxed"
            style={{ color: 'rgba(58,42,42,0.8)', maxWidth: 420, fontWeight: 600 }}
          >
            {profile.tagline}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 flex-wrap"
          >
            <a href="#demos" className="btn-primary">
              <span>🎶</span>
              Hear My Voice
            </a>
            <a href="#contact" className="btn-secondary">
              Get In Touch 💌
            </a>
          </motion.div>

          {/* Mini stat pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3 flex-wrap mt-8"
          >
            {['🌸 Anime', '🎮 Video Games', '📺 Commercial'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full font-body text-xs font-700"
                style={{
                  background: 'rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(6px)',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  color: '#B93360',
                  letterSpacing: '0.04em',
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Photo side ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="flex justify-center items-center relative"
        >
          {/* Spinning ring */}
          <div
            className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, #FDC77D, #FD7E85, #D85F7E, #B93360, #FD7E85, #FDC77D)',
              opacity: 0.35,
              padding: '3px',
            }}
          />

          {/* Glow */}
          <div
            className="absolute w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(253,126,133,0.4), transparent 70%)', filter: 'blur(20px)' }}
          />

          {/* Photo container */}
          <div className="relative animate-float z-10">
            <div
              className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden"
              style={{
                border: '5px solid white',
                boxShadow: '0 20px 60px rgba(185,51,96,0.3), 0 0 0 3px #FDC77D',
              }}
            >
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt={profile.name} fill className="object-cover" />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #FFF095, #FDC77D, #FF9C7F)' }}
                >
                  <span style={{ fontSize: '3.5rem' }}>🎙️</span>
                  <span className="font-display font-900 text-3xl" style={{ color: '#B93360' }}>
                    {profile.name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Orbit stickers */}
            {ORBIT_STICKERS.map((emoji, i) => {
              const angle = (i / ORBIT_STICKERS.length) * 360
              const rad = (angle * Math.PI) / 180
              const r = 170
              const x = Math.cos(rad) * r
              const y = Math.sin(rad) * r
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
                  className="absolute sticker animate-wiggle"
                  style={{
                    left: `calc(50% + ${x}px - 26px)`,
                    top: `calc(50% + ${y}px - 26px)`,
                    width: 52,
                    height: 52,
                    fontSize: '1.4rem',
                    animationDelay: `${i * 0.4}s`,
                    background: 'white',
                  }}
                >
                  {emoji}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,10 1440,45 L1440,90 L0,90 Z" fill="white" fillOpacity="0.15"/>
          <path d="M0,60 C360,95 1080,20 1440,60 L1440,90 L0,90 Z" fill="#FFF3CB" />
        </svg>
      </div>
    </section>
  )
}
