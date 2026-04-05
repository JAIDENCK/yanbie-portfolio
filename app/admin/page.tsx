'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, uploadFile } from '@/lib/supabase'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Profile, Demo, CharacterRange } from '@/lib/types'
import { SparkleIcon } from '@/components/public/Sparkles'

// ─── Sortable Demo Card ───────────────────────────────────────────────────────

function SortableDemo({
  demo,
  onEdit,
  onDelete,
}: {
  demo: Demo
  onEdit: (d: Demo) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: demo.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-2xl"
      {...attributes}
    >
      <div
        {...listeners}
        className="cursor-grab text-gray-300 hover:text-gray-400 flex-shrink-0"
        title="Drag to reorder"
      >
        ⠿
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-700 text-sm truncate" style={{ color: '#3a2a2a' }}>{demo.title}</p>
        <span className="tag-pill" style={{ fontSize: '0.65rem' }}>{demo.tag}</span>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => onEdit(demo)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(demo.id)} className="admin-btn-sm danger">Delete</button>
      </div>
    </div>
  )
}

// ─── Sortable Range Card ──────────────────────────────────────────────────────

function SortableRange({
  range,
  onEdit,
  onDelete,
}: {
  range: CharacterRange
  onEdit: (r: CharacterRange) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: range.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-4 rounded-2xl" {...attributes}>
      <div {...listeners} className="cursor-grab text-gray-300 hover:text-gray-400 flex-shrink-0">⠿</div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-700 text-sm truncate" style={{ color: '#3a2a2a' }}>{range.label}</p>
        {range.description && (
          <p className="font-body text-xs truncate" style={{ color: '#7a5a5a' }}>{range.description}</p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => onEdit(range)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(range.id)} className="admin-btn-sm danger">Delete</button>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'demos' | 'characters'>('profile')

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  // Demos state
  const [demos, setDemos] = useState<Demo[]>([])
  const [editingDemo, setEditingDemo] = useState<Partial<Demo> | null>(null)
  const [demoAudioFile, setDemoAudioFile] = useState<File | null>(null)
  const demoAudioRef = useRef<HTMLInputElement>(null)

  // Ranges state
  const [ranges, setRanges] = useState<CharacterRange[]>([])
  const [editingRange, setEditingRange] = useState<Partial<CharacterRange> | null>(null)
  const [rangeAudioFile, setRangeAudioFile] = useState<File | null>(null)
  const rangeAudioRef = useRef<HTMLInputElement>(null)

  const [toast, setToast] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // ── Auth check ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login')
      } else {
        fetchAll()
      }
    })
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [p, d, r] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('demos').select('*').order('order_index'),
      supabase.from('character_ranges').select('*').order('order_index'),
    ])
    if (p.data) setProfile(p.data)
    if (d.data) setDemos(d.data)
    if (r.data) setRanges(r.data)
    setLoading(false)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ── Sign out ──
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // ── Save profile ──
  const saveProfile = async () => {
    if (!profile) return
    setSaving(true)
    let photo_url = profile.photo_url

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      photo_url = await uploadFile('images', `profile.${ext}`, photoFile)
    }

    const updated = { ...profile, photo_url }
    const { error } = await supabase.from('profile').upsert(updated)
    if (!error) {
      setProfile(updated)
      setPhotoFile(null)
      showToast('✦ Profile saved!')
    } else {
      showToast('Error: ' + error.message)
    }
    setSaving(false)
  }

  // ── Demo CRUD ──
  const saveDemo = async () => {
    if (!editingDemo?.title || !editingDemo.tag) return
    setSaving(true)

    let audio_url = editingDemo.audio_url ?? ''
    if (demoAudioFile) {
      const fileName = `demo-${Date.now()}.${demoAudioFile.name.split('.').pop()}`
      audio_url = await uploadFile('audio', fileName, demoAudioFile)
    }

    if (!audio_url) {
      showToast('Please upload an audio file.')
      setSaving(false)
      return
    }

    if (editingDemo.id) {
      // Update
      const { error } = await supabase
        .from('demos')
        .update({ title: editingDemo.title, tag: editingDemo.tag, audio_url })
        .eq('id', editingDemo.id)
      if (!error) {
        setDemos((prev) => prev.map((d) => (d.id === editingDemo.id ? { ...d, title: editingDemo.title!, tag: editingDemo.tag!, audio_url } : d)))
        showToast('✦ Demo updated!')
      }
    } else {
      // Insert
      const order_index = demos.length
      const { data, error } = await supabase
        .from('demos')
        .insert({ title: editingDemo.title, tag: editingDemo.tag, audio_url, order_index })
        .select()
        .single()
      if (!error && data) {
        setDemos((prev) => [...prev, data])
        showToast('✦ Demo added!')
      }
    }

    setEditingDemo(null)
    setDemoAudioFile(null)
    setSaving(false)
  }

  const deleteDemo = async (id: string) => {
    if (!confirm('Delete this demo?')) return
    await supabase.from('demos').delete().eq('id', id)
    setDemos((prev) => prev.filter((d) => d.id !== id))
    showToast('Demo deleted.')
  }

  const handleDemoReorder = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = demos.findIndex((d) => d.id === active.id)
    const newIndex = demos.findIndex((d) => d.id === over.id)
    const reordered = arrayMove(demos, oldIndex, newIndex).map((d, i) => ({ ...d, order_index: i }))
    setDemos(reordered)
    await Promise.all(reordered.map((d) => supabase.from('demos').update({ order_index: d.order_index }).eq('id', d.id)))
  }

  // ── Range CRUD ──
  const saveRange = async () => {
    if (!editingRange?.label) return
    setSaving(true)

    let audio_url = editingRange.audio_url ?? ''
    if (rangeAudioFile) {
      const fileName = `range-${Date.now()}.${rangeAudioFile.name.split('.').pop()}`
      audio_url = await uploadFile('audio', fileName, rangeAudioFile)
    }

    if (!audio_url) {
      showToast('Please upload an audio file.')
      setSaving(false)
      return
    }

    if (editingRange.id) {
      const { error } = await supabase
        .from('character_ranges')
        .update({ label: editingRange.label, description: editingRange.description ?? '', audio_url })
        .eq('id', editingRange.id)
      if (!error) {
        setRanges((prev) => prev.map((r) => (r.id === editingRange.id ? { ...r, label: editingRange.label!, description: editingRange.description ?? '', audio_url } : r)))
        showToast('✦ Character updated!')
      }
    } else {
      const order_index = ranges.length
      const { data, error } = await supabase
        .from('character_ranges')
        .insert({ label: editingRange.label, description: editingRange.description ?? '', audio_url, order_index })
        .select()
        .single()
      if (!error && data) {
        setRanges((prev) => [...prev, data])
        showToast('✦ Character added!')
      }
    }

    setEditingRange(null)
    setRangeAudioFile(null)
    setSaving(false)
  }

  const deleteRange = async (id: string) => {
    if (!confirm('Delete this character range?')) return
    await supabase.from('character_ranges').delete().eq('id', id)
    setRanges((prev) => prev.filter((r) => r.id !== id))
    showToast('Character deleted.')
  }

  const handleRangeReorder = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ranges.findIndex((r) => r.id === active.id)
    const newIndex = ranges.findIndex((r) => r.id === over.id)
    const reordered = arrayMove(ranges, oldIndex, newIndex).map((r, i) => ({ ...r, order_index: i }))
    setRanges(reordered)
    await Promise.all(reordered.map((r) => supabase.from('character_ranges').update({ order_index: r.order_index }).eq('id', r.id)))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF3CB' }}>
        <div className="text-center">
          <div className="animate-spin-slow mb-4 flex justify-center">
            <SparkleIcon size={40} color="#FD7E85" />
          </div>
          <p className="font-display text-xl" style={{ color: '#B93360' }}>Loading your studio…</p>
        </div>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 rounded-2xl font-body text-sm outline-none border-2 transition-all"
  const inputStyle = { borderColor: '#E3DDD1', background: 'white', color: '#3a2a2a' }

  const TABS = [
    { key: 'profile', label: '✦ Profile' },
    { key: 'demos', label: '✦ Demos' },
    { key: 'characters', label: '✦ Characters' },
  ] as const

  return (
    <>
      {/* Inline styles for admin utility classes */}
      <style>{`
        .admin-btn-sm {
          padding: 6px 14px;
          border-radius: 99px;
          font-family: 'Nunito', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          border: 2px solid #D85F7E;
          color: #D85F7E;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
        }
        .admin-btn-sm:hover {
          background: #D85F7E;
          color: white;
        }
        .admin-btn-sm.danger {
          border-color: #B93360;
          color: #B93360;
        }
        .admin-btn-sm.danger:hover {
          background: #B93360;
          color: white;
        }
        .admin-card {
          background: white;
          border-radius: 20px;
          border: 1.5px solid #E3DDD1;
          padding: 28px;
          margin-bottom: 20px;
        }
        .admin-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: #B93360;
          margin-bottom: 20px;
        }
        .admin-label {
          font-family: 'Nunito', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B93360;
          margin-bottom: 6px;
          display: block;
        }
        .admin-input {
          width: 100%;
          padding: 10px 16px;
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 0.9rem;
          border: 2px solid #E3DDD1;
          background: white;
          color: #3a2a2a;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-input:focus { border-color: #FD7E85; }
        .list-row { background: #FFF3CB30; border: 1px solid #E3DDD1; border-radius: 14px; margin-bottom: 8px; }
        .list-row:hover { background: #FFF3CB80; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#F5EFE6' }}>
        {/* Top bar */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
          style={{ background: 'white', borderBottom: '1.5px solid #E3DDD1', boxShadow: '0 2px 12px rgba(185,51,96,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <SparkleIcon size={20} color="#FDC77D" />
            <span className="font-display font-bold text-xl" style={{ color: '#B93360' }}>Yanbie</span>
            <span className="font-body text-sm" style={{ color: '#D85F7E' }}>Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="font-body text-sm font-600 transition-colors hover:underline"
              style={{ color: '#D85F7E' }}
            >
              View Site →
            </a>
            <button onClick={signOut} className="admin-btn-sm">Sign Out</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-6 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2.5 rounded-t-2xl font-body font-700 text-sm transition-all"
              style={{
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? '#B93360' : '#7a5a5a',
                border: activeTab === tab.key ? '1.5px solid #E3DDD1' : '1.5px solid transparent',
                borderBottom: activeTab === tab.key ? '1.5px solid white' : '1.5px solid transparent',
                marginBottom: activeTab === tab.key ? '-1px' : 0,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="mx-6 mb-6 rounded-b-3xl rounded-tr-3xl p-8"
          style={{ background: 'white', border: '1.5px solid #E3DDD1', minHeight: '70vh' }}
        >

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && profile && (
            <div className="max-w-2xl">
              <h2 className="admin-section-title">Profile Information</h2>

              <div className="admin-card">
                <h3 className="font-body font-700 text-sm mb-4" style={{ color: '#D85F7E' }}>Basic Info</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="admin-label">Display Name</label>
                    <input className="admin-input" value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="admin-label">Tagline</label>
                    <input className="admin-input" value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} />
                  </div>
                  <div>
                    <label className="admin-label">About Me</label>
                    <textarea
                      className="admin-input"
                      rows={5}
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input className="admin-input" type="email" value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 className="font-body font-700 text-sm mb-4" style={{ color: '#D85F7E' }}>Profile Photo</h3>
                {profile.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photo_url} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" style={{ border: '3px solid #FDC77D' }} />
                )}
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
                <button onClick={() => photoRef.current?.click()} className="admin-btn-sm">
                  {photoFile ? `✓ ${photoFile.name}` : 'Upload Photo'}
                </button>
              </div>

              <div className="admin-card">
                <h3 className="font-body font-700 text-sm mb-4" style={{ color: '#D85F7E' }}>Social Links</h3>
                <div className="flex flex-col gap-3">
                  {([
                    ['twitter', 'Twitter / X'],
                    ['instagram', 'Instagram'],
                    ['tiktok', 'TikTok'],
                    ['youtube', 'YouTube'],
                    ['casting_call_club', 'Casting Call Club'],
                    ['voices_com', 'Voices.com'],
                  ] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="admin-label">{label}</label>
                      <input
                        className="admin-input"
                        placeholder={`https://...`}
                        value={(profile.socials as Record<string, string>)[key] ?? ''}
                        onChange={(e) =>
                          setProfile({ ...profile, socials: { ...profile.socials, [key]: e.target.value } })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="btn-primary"
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : '✦ Save Profile'}
              </button>
            </div>
          )}

          {/* ── DEMOS TAB ── */}
          {activeTab === 'demos' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="admin-section-title mb-0">Demo Reels</h2>
                <button
                  onClick={() => { setEditingDemo({}); setDemoAudioFile(null) }}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  + Add Demo
                </button>
              </div>

              {/* Edit/Add form */}
              {editingDemo !== null && (
                <div className="admin-card" style={{ borderColor: '#FD7E85' }}>
                  <h3 className="font-body font-700 text-sm mb-4" style={{ color: '#D85F7E' }}>
                    {editingDemo.id ? 'Edit Demo' : 'New Demo'}
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="admin-label">Title</label>
                      <input className="admin-input" placeholder="e.g. Anime Action Reel"
                        value={editingDemo.title ?? ''}
                        onChange={(e) => setEditingDemo({ ...editingDemo, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="admin-label">Tag / Genre</label>
                      <input className="admin-input" placeholder="e.g. Anime Dub"
                        value={editingDemo.tag ?? ''}
                        onChange={(e) => setEditingDemo({ ...editingDemo, tag: e.target.value })} />
                    </div>
                    <div>
                      <label className="admin-label">Audio File</label>
                      <input ref={demoAudioRef} type="file" accept="audio/*" style={{ display: 'none' }}
                        onChange={(e) => setDemoAudioFile(e.target.files?.[0] ?? null)} />
                      <button onClick={() => demoAudioRef.current?.click()} className="admin-btn-sm">
                        {demoAudioFile ? `✓ ${demoAudioFile.name}` : editingDemo.audio_url ? '✓ Has audio (replace?)' : 'Upload Audio'}
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveDemo} disabled={saving} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', opacity: saving ? 0.7 : 1 }}>
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => { setEditingDemo(null); setDemoAudioFile(null) }} className="admin-btn-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List */}
              {demos.length === 0 ? (
                <p className="font-body text-sm text-center py-12" style={{ color: '#B93360', opacity: 0.5 }}>
                  No demos yet — add your first one! ✦
                </p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDemoReorder}>
                  <SortableContext items={demos.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                    {demos.map((demo) => (
                      <div key={demo.id} className="list-row">
                        <SortableDemo
                          demo={demo}
                          onEdit={(d) => { setEditingDemo(d); setDemoAudioFile(null) }}
                          onDelete={deleteDemo}
                        />
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          )}

          {/* ── CHARACTERS TAB ── */}
          {activeTab === 'characters' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="admin-section-title mb-0">Character Range</h2>
                <button
                  onClick={() => { setEditingRange({}); setRangeAudioFile(null) }}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  + Add Character
                </button>
              </div>

              {editingRange !== null && (
                <div className="admin-card" style={{ borderColor: '#FD7E85' }}>
                  <h3 className="font-body font-700 text-sm mb-4" style={{ color: '#D85F7E' }}>
                    {editingRange.id ? 'Edit Character Range' : 'New Character Range'}
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="admin-label">Label</label>
                      <input className="admin-input" placeholder="e.g. The Gentle Hero"
                        value={editingRange.label ?? ''}
                        onChange={(e) => setEditingRange({ ...editingRange, label: e.target.value })} />
                    </div>
                    <div>
                      <label className="admin-label">Description</label>
                      <textarea className="admin-input" rows={3} placeholder="Short description of this voice style…"
                        value={editingRange.description ?? ''}
                        onChange={(e) => setEditingRange({ ...editingRange, description: e.target.value })}
                        style={{ resize: 'vertical' }} />
                    </div>
                    <div>
                      <label className="admin-label">Audio File</label>
                      <input ref={rangeAudioRef} type="file" accept="audio/*" style={{ display: 'none' }}
                        onChange={(e) => setRangeAudioFile(e.target.files?.[0] ?? null)} />
                      <button onClick={() => rangeAudioRef.current?.click()} className="admin-btn-sm">
                        {rangeAudioFile ? `✓ ${rangeAudioFile.name}` : editingRange.audio_url ? '✓ Has audio (replace?)' : 'Upload Audio'}
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveRange} disabled={saving} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', opacity: saving ? 0.7 : 1 }}>
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => { setEditingRange(null); setRangeAudioFile(null) }} className="admin-btn-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {ranges.length === 0 ? (
                <p className="font-body text-sm text-center py-12" style={{ color: '#B93360', opacity: 0.5 }}>
                  No character ranges yet ✦
                </p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleRangeReorder}>
                  <SortableContext items={ranges.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                    {ranges.map((range) => (
                      <div key={range.id} className="list-row">
                        <SortableRange
                          range={range}
                          onEdit={(r) => { setEditingRange(r); setRangeAudioFile(null) }}
                          onDelete={deleteRange}
                        />
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl font-body font-700 text-sm"
          style={{
            background: 'linear-gradient(135deg, #D85F7E, #B93360)',
            color: 'white',
            boxShadow: '0 8px 24px rgba(185,51,96,0.35)',
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
