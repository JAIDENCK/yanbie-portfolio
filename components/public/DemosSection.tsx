'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { AudioPlayer } from './AudioPlayer'
import { SectionSparkles } from './Sparkles'
import type { Demo } from '@/lib/types'

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Anime Dub': { bg: '#FD7E8520', text: '#B93360' },
  'Commercial': { bg: '#FDC77D30', text: '#8B4513' },
  'Video Game': { bg: '#D85F7E20', text: '#8B1A4A' },
  'Narration': { bg: '#FFF09540', text: '#6B5B00' },
  'Animation': { bg: '#FF9C7F20', text: '#8B3A00' },
  default: { bg: '#E3DDD1', text: '#5a3a3a' },
}

function tagColor(tag: string) {
  return TAG_COLORS[tag] ?? TAG_COLORS.default
}

export function DemosSection({ demos }: { demos: Demo[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="demos"
      className="relative py-28 overflow-hidden"
      style={{ background: '#FFF095' }}
    >
      <SectionSparkles />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="section-subtitle">✦ Listen In ✦</p>
          <h2 className="section-title">Demo Reels</h2>
          <p className="font-body text-lg mt-4" style={{ color: '#5a3a3a', fontWeight: 500 }}>
            A selection of my favourite performances across genres
          </p>
        </motion.div>

        {demos.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#B93360', opacity: 0.5 }}>
            <p className="font-display text-2xl">Demos coming soon ✨</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo, i) => {
              const tc = tagColor(demo.tag)
              return (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6"
                  style={{ background: 'white' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="font-display font-bold text-lg leading-tight"
                      style={{ color: '#3a2a2a' }}
                    >
                      {demo.title}
                    </h3>
                    <span
                      className="tag-pill flex-shrink-0 ml-2"
                      style={{ background: tc.bg, color: tc.text, borderColor: tc.text + '40' }}
                    >
                      {demo.tag}
                    </span>
                  </div>
                  <AudioPlayer src={demo.audio_url} title={demo.title} />
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C360,60 1080,0 1440,20 L1440,60 L0,60 Z" fill="#FDC77D" />
        </svg>
      </div>
    </section>
  )
}
