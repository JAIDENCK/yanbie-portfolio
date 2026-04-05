'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionSparkles, SparkleIcon } from './Sparkles'
import type { Profile } from '@/lib/types'

export function AboutSection({ profile }: { profile: Profile }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      className="relative py-28 overflow-hidden"
      style={{ background: '#FFF3CB' }}
    >
      <SectionSparkles />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center" ref={ref}>
          {/* Decorative left panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div
              className="relative rounded-3xl p-8 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FDC77D20, #FD7E8530)',
                border: '2px solid #FDC77D',
              }}
            >
              {/* Quote marks */}
              <div
                className="font-display text-9xl leading-none absolute top-2 left-6 opacity-10"
                style={{ color: '#B93360' }}
              >
                "
              </div>

              <div className="relative z-10">
                <p className="section-subtitle">✦ A Little About Me</p>
                <h2 className="section-title mb-6">The Voice Behind the Magic</h2>
                <p
                  className="font-body text-lg leading-relaxed"
                  style={{ color: '#5a3a3a', fontWeight: 500 }}
                >
                  {profile.about}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats / fun facts column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            {[
              { label: 'Genres', value: 'Anime · Commercial · Game · Narration' },
              { label: 'Range', value: 'Soft & Gentle → Bold & Powerful' },
              { label: 'Languages', value: 'English · Open to Direction' },
              { label: 'Availability', value: 'Not for Bookings' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card p-5 flex items-center gap-4"
                style={{ background: 'white' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FDC77D, #FD7E85)' }}
                >
                  <SparkleIcon size={14} color="white" />
                </div>
                <div>
                  <p className="font-body text-xs font-700 uppercase tracking-widest" style={{ color: '#B93360' }}>
                    {item.label}
                  </p>
                  <p className="font-body font-600" style={{ color: '#3a2a2a', fontWeight: 600 }}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#FFF095" />
        </svg>
      </div>
    </section>
  )
}
