'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { AudioPlayer } from './AudioPlayer'
import { SectionSparkles, SparkleIcon } from './Sparkles'
import type { CharacterRange } from '@/lib/types'

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #FFF3CB, #FDC77D)',
  'linear-gradient(135deg, #FDC77D, #FF9C7F)',
  'linear-gradient(135deg, #FF9C7F, #FD7E85)',
  'linear-gradient(135deg, #FD7E85, #D85F7E)',
  'linear-gradient(135deg, #D85F7E, #B93360)',
  'linear-gradient(135deg, #FFF095, #FDC77D)',
]

export function CharacterRangeSection({ ranges }: { ranges: CharacterRange[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="characters"
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FDC77D 0%, #FF9C7F 50%, #FD7E85 100%)' }}
    >
      <SectionSparkles />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="section-subtitle" style={{ color: '#B93360' }}>✦ Voice Range ✦</p>
          <h2 className="section-title" style={{ color: 'white', textShadow: '0 2px 20px rgba(185,51,96,0.3)' }}>
            Character Gallery
          </h2>
          <p className="font-body text-lg mt-4" style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            From soft and sweet to fierce and commanding — here's my range
          </p>
        </motion.div>

        {ranges.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'white', opacity: 0.7 }}>
            <p className="font-display text-2xl">Character samples coming soon ✨</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranges.map((range, i) => (
              <motion.div
                key={range.id}
                initial={{ opacity: 0, y: 30, rotate: -1 }}
                animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: '0 8px 32px rgba(185,51,96,0.2)',
                }}
              >
                {/* Top colour strip */}
                <div
                  className="h-2"
                  style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
                    >
                      <SparkleIcon size={12} color="white" />
                    </div>
                    <h3
                      className="font-display font-bold text-lg"
                      style={{ color: '#3a2a2a' }}
                    >
                      {range.label}
                    </h3>
                  </div>
                  {range.description && (
                    <p
                      className="font-body text-sm mb-4 leading-relaxed"
                      style={{ color: '#7a5a5a', fontWeight: 500 }}
                    >
                      {range.description}
                    </p>
                  )}
                  <AudioPlayer src={range.audio_url} title={range.label} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C720,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#D85F7E" />
        </svg>
      </div>
    </section>
  )
}
