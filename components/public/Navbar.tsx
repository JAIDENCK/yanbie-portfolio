'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,243,203,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #D6CCBF' : 'none',
        padding: scrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl" style={{ color: '#B93360' }}>
          Yanbie
        </Link>
        <div className="flex items-center gap-8">
          {['About', 'Demos', 'Characters', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body font-600 text-sm transition-colors hover:text-rose-500"
              style={{ color: '#3a2a2a', fontWeight: 600 }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
