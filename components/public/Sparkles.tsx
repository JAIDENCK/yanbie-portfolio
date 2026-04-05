'use client'

export function StarIcon({ size = 20, color = '#FDC77D' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="sparkle">
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
    </svg>
  )
}

export function HeartIcon({ size = 20, color = '#FD7E85' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="sparkle">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

export function SparkleIcon({ size = 20, color = '#FDC77D' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="sparkle">
      <path d="M12 2 L13.09 8.26 L19 6 L14.74 10.91 L21 12 L14.74 13.09 L19 18 L13.09 15.74 L12 22 L10.91 15.74 L5 18 L9.26 13.09 L3 12 L9.26 10.91 L5 6 L10.91 8.26 Z" />
    </svg>
  )
}

// The big floating background decorations
export function FloatingSparkles() {
  const items = [
    { top: '6%',  left: '3%',   type: 'star',    size: 22, color: '#FDC77D', delay: '0s',    anim: 'animate-float-slow' },
    { top: '10%', right: '5%',  type: 'heart',   size: 18, color: '#FD7E85', delay: '0.8s',  anim: 'animate-float' },
    { top: '22%', left: '6%',   type: 'sparkle', size: 14, color: '#D85F7E', delay: '1.6s',  anim: 'animate-drift' },
    { top: '35%', right: '3%',  type: 'star',    size: 26, color: '#FFF095', delay: '0.4s',  anim: 'animate-float-slow' },
    { top: '50%', left: '1%',   type: 'heart',   size: 14, color: '#FF9C7F', delay: '2s',    anim: 'animate-float-fast' },
    { top: '62%', right: '6%',  type: 'sparkle', size: 20, color: '#FDC77D', delay: '1.2s',  anim: 'animate-drift' },
    { top: '75%', left: '5%',   type: 'star',    size: 16, color: '#FD7E85', delay: '0.6s',  anim: 'animate-float' },
    { top: '82%', right: '2%',  type: 'heart',   size: 24, color: '#D85F7E', delay: '1.8s',  anim: 'animate-float-slow' },
    { top: '90%', left: '8%',   type: 'sparkle', size: 12, color: '#FFF095', delay: '3s',    anim: 'animate-float-fast' },
    { top: '15%', left: '45%',  type: 'star',    size: 10, color: '#FF9C7F', delay: '2.5s',  anim: 'animate-drift' },
  ]

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className={`fixed pointer-events-none z-0 ${item.anim}`}
          style={{
            top: item.top,
            left: 'left' in item ? item.left : undefined,
            right: 'right' in item ? item.right : undefined,
            animationDelay: item.delay,
            opacity: 0.55,
          }}
        >
          {item.type === 'star' && <StarIcon size={item.size} color={item.color} />}
          {item.type === 'heart' && <HeartIcon size={item.size} color={item.color} />}
          {item.type === 'sparkle' && <SparkleIcon size={item.size} color={item.color} />}
        </div>
      ))}
    </>
  )
}

export function SectionSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-6 right-16 animate-float-slow" style={{ animationDelay: '0.3s', opacity: 0.6 }}>
        <StarIcon size={16} color="#FDC77D" />
      </div>
      <div className="absolute bottom-10 left-20 animate-drift" style={{ animationDelay: '1s', opacity: 0.5 }}>
        <HeartIcon size={14} color="#FD7E85" />
      </div>
      <div className="absolute top-1/3 right-8 animate-float-fast" style={{ animationDelay: '1.5s', opacity: 0.4 }}>
        <SparkleIcon size={10} color="#D85F7E" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-float-slow" style={{ animationDelay: '2s', opacity: 0.4 }}>
        <StarIcon size={12} color="#FF9C7F" />
      </div>
    </div>
  )
}
