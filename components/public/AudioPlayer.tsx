'use client'
import { useState, useRef } from 'react'

interface AudioPlayerProps {
  src: string
  title: string
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  const onTimeUpdate = () => {
    if (!audioRef.current) return
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
  }

  const onLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const onEnded = () => setPlaying(false)

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    audioRef.current.currentTime = pct * audioRef.current.duration
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        style={{ display: 'none' }}
      />
      <div className="flex items-center gap-3">
        {/* Play button */}
        <button
          onClick={toggle}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: playing
              ? 'linear-gradient(135deg, #B93360, #D85F7E)'
              : 'linear-gradient(135deg, #D85F7E, #FD7E85)',
            boxShadow: '0 4px 14px rgba(185,51,96,0.3)',
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="2" y="1" width="3.5" height="12" rx="1" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <path d="M3 1.5 L12 7 L3 12.5 Z" />
            </svg>
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div
            className="w-full h-2 rounded-full cursor-pointer overflow-hidden"
            style={{ background: '#E3DDD1' }}
            onClick={seek}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FD7E85, #B93360)',
              }}
            />
          </div>
          <div className="flex justify-between text-xs font-body" style={{ color: '#B93360', fontWeight: 600 }}>
            <span>{fmt((progress / 100) * duration)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
