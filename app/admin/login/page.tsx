'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SparkleIcon } from '@/components/public/Sparkles'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #FFF3CB 0%, #FDC77D 50%, #FD7E85 100%)' }}
    >
      {/* Sparkles */}
      <div className="fixed top-10 left-10 animate-float-slow opacity-50">
        <SparkleIcon size={24} color="#B93360" />
      </div>
      <div className="fixed bottom-10 right-10 animate-float opacity-40" style={{ animationDelay: '1s' }}>
        <SparkleIcon size={18} color="#D85F7E" />
      </div>

      <div
        className="w-full max-w-md rounded-3xl p-10"
        style={{
          background: 'white',
          boxShadow: '0 20px 60px rgba(185,51,96,0.2)',
          border: '1.5px solid #D6CCBF',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SparkleIcon size={36} color="#FDC77D" />
          </div>
          <h1
            className="font-display font-900 mb-2"
            style={{ fontSize: '2.2rem', color: '#B93360' }}
          >
            Yanbie
          </h1>
          <p className="font-body text-sm font-600" style={{ color: '#D85F7E' }}>
            Admin Panel ✦ Sign In
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-body text-xs font-700 uppercase tracking-widest mb-2 block" style={{ color: '#B93360' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-2xl font-body text-sm outline-none transition-all"
              style={{
                border: '2px solid #E3DDD1',
                background: '#FFF3CB20',
                color: '#3a2a2a',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#FD7E85')}
              onBlur={(e) => (e.target.style.borderColor = '#E3DDD1')}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div>
            <label className="font-body text-xs font-700 uppercase tracking-widest mb-2 block" style={{ color: '#B93360' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl font-body text-sm outline-none transition-all"
              style={{
                border: '2px solid #E3DDD1',
                background: '#FFF3CB20',
                color: '#3a2a2a',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#FD7E85')}
              onBlur={(e) => (e.target.style.borderColor = '#E3DDD1')}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <p className="font-body text-sm text-center" style={{ color: '#B93360' }}>
              ✦ {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary justify-center mt-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In ✦'}
          </button>

          <a
            href="/"
            className="text-center font-body text-sm font-600 transition-colors hover:underline"
            style={{ color: '#D85F7E' }}
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  )
}
