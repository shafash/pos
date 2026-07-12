import { useState } from 'react'
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useAuth } from '../context/AuthContext'

const font = "'Geist', sans-serif"

export default function Login({ onLogin }) {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()

  const isDisabled = !email.trim() || !password.trim()

  const handleSubmit = async () => {
    if (isDisabled || isLoading) return
    setError('')
    setIsLoading(true)
    try {
      await login(email.trim(), password)
      onLogin?.()
    } catch (err) {
      const msg = err.response?.data?.message
        ?? err.response?.data?.errors?.email?.[0]
        ?? 'Email atau password salah.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     '#F3F4F6',
      fontFamily:     font,
      padding:        16,
      boxSizing:      'border-box',
    }}>
      <div style={{
        display:      'flex',
        width:        '100%',
        maxWidth:     900,
        minHeight:    520,
        borderRadius: 20,
        overflow:     'hidden',
        boxShadow:    '0 20px 60px rgba(0,0,0,0.15)',
      }}>

        {/* ── Panel Kiri: Foto + Branding ── */}
        <div style={{
          flex:       1,
          position:   'relative',
          display:    'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:    32,
          minWidth:   0,
          // Foto gudang sebagai background — pakai gradient overlay supaya teks terbaca
          background: 'linear-gradient(135deg, #1a2a1a 0%, #2d4a1e 40%, #3a5a28 100%)',
          overflow:   'hidden',
        }}>

          {/* Simulasi foto gudang dengan overlay gradient */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: `
              linear-gradient(
                to bottom,
                rgba(20, 35, 15, 0.3) 0%,
                rgba(20, 35, 15, 0.75) 100%
              )
            `,
            zIndex: 1,
          }} />

          {/* Rak-rak gudang simulasi (SVG sederhana) */}
          <svg
            viewBox="0 0 400 520"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Rak kiri */}
            <rect x="20" y="60"  width="8" height="420" fill="#8B7355" />
            <rect x="20" y="60"  width="120" height="6"  fill="#8B7355" />
            <rect x="20" y="160" width="120" height="6"  fill="#8B7355" />
            <rect x="20" y="260" width="120" height="6"  fill="#8B7355" />
            <rect x="20" y="360" width="120" height="6"  fill="#8B7355" />
            <rect x="132" y="60" width="8"   height="420" fill="#8B7355" />
            {/* Boxes rak kiri */}
            {[80,180,280,380].map(y => (
              <>
                <rect key={`bl1-${y}`} x="28"  y={y-30} width="30" height="28" fill="#D4A855" rx="2"/>
                <rect key={`bl2-${y}`} x="62"  y={y-30} width="30" height="28" fill="#C8912A" rx="2"/>
                <rect key={`bl3-${y}`} x="96"  y={y-30} width="30" height="28" fill="#D4A855" rx="2"/>
              </>
            ))}
            {/* Rak tengah */}
            <rect x="160" y="40"  width="8" height="440" fill="#8B7355" />
            <rect x="160" y="40"  width="120" height="6"  fill="#8B7355" />
            <rect x="160" y="140" width="120" height="6"  fill="#8B7355" />
            <rect x="160" y="240" width="120" height="6"  fill="#8B7355" />
            <rect x="160" y="340" width="120" height="6"  fill="#8B7355" />
            <rect x="160" y="440" width="120" height="6"  fill="#8B7355" />
            <rect x="272" y="40"  width="8"   height="440" fill="#8B7355" />
            {[100,200,300,400].map(y => (
              <>
                <rect key={`bm1-${y}`} x="168" y={y-35} width="34" height="32" fill="#C8912A" rx="2"/>
                <rect key={`bm2-${y}`} x="206" y={y-35} width="34" height="32" fill="#D4A855" rx="2"/>
                <rect key={`bm3-${y}`} x="232" y={y-35} width="32" height="32" fill="#B8813A" rx="2"/>
              </>
            ))}
            {/* Rak kanan */}
            <rect x="300" y="80"  width="8" height="400" fill="#8B7355" />
            <rect x="300" y="80"  width="100" height="6"  fill="#8B7355" />
            <rect x="300" y="180" width="100" height="6"  fill="#8B7355" />
            <rect x="300" y="280" width="100" height="6"  fill="#8B7355" />
            <rect x="300" y="380" width="100" height="6"  fill="#8B7355" />
            <rect x="392" y="80"  width="8"   height="400" fill="#8B7355" />
            {[120,220,320,420].map(y => (
              <>
                <rect key={`br1-${y}`} x="308" y={y-30} width="28" height="26" fill="#D4A855" rx="2"/>
                <rect key={`br2-${y}`} x="340" y={y-30} width="28" height="26" fill="#C8912A" rx="2"/>
                <rect key={`br3-${y}`} x="360" y={y-30} width="28" height="26" fill="#D4A855" rx="2"/>
              </>
            ))}
            {/* Lantai */}
            <rect x="0" y="480" width="400" height="40" fill="#5C4A32" opacity="0.5"/>
          </svg>

          {/* Logo */}
          <div style={{
            position:    'absolute',
            top:         28,
            left:        28,
            zIndex:      2,
            display:     'flex',
            alignItems:  'center',
            gap:         10,
          }}>
            <div style={{
              width:          40, height: 40,
              background:     COLOR.amber,
              borderRadius:   10,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, fontFamily: font }}>EA</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: font }}>
              ElangAnugerah
            </span>
          </div>

          {/* Teks branding di bawah */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              fontSize:     26,
              fontWeight:   800,
              color:        '#fff',
              fontFamily:   font,
              lineHeight:   1.3,
              marginBottom: 12,
            }}>
              Solusi Manajemen Inventaris<br />
              Aki Terpercaya.
            </div>
            <div style={{
              fontSize:   13,
              color:      'rgba(255,255,255,0.75)',
              fontFamily: font,
              lineHeight: 1.6,
              maxWidth:   280,
            }}>
              Tingkatkan operasional bengkel dan toko aki Anda dalam satu genggaman yang aman dan cepat.
            </div>
          </div>
        </div>

        {/* ── Panel Kanan: Form Login ── */}
        <div style={{
          width:          380,
          flexShrink:     0,
          background:     '#fff',
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          padding:        '40px 36px',
        }}>
          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontSize:     13,
              fontWeight:   600,
              color:        COLOR.amber,
              fontFamily:   font,
              marginBottom: 6,
              letterSpacing: 0.5,
            }}>
              Selamat Datang
            </div>
            <div style={{
              fontSize:   20,
              fontWeight: 700,
              color:      '#111',
              fontFamily: font,
            }}>
              Masuk ke akun Anda untuk melanjutkan sistem.
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:   '#FEF2F2',
              border:       '1px solid #FECACA',
              borderRadius: 8,
              padding:      '10px 14px',
              fontSize:     13,
              color:        '#DC2626',
              fontFamily:   font,
              marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          {/* Input Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontSize: 12, fontWeight: 600,
              color: '#555', fontFamily: font,
              marginBottom: 6, display: 'block',
            }}>
              Username/Email
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={15}
                color="#aaa"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="Masukkan username Anda"
                style={{
                  width:        '100%',
                  height:       42,
                  background:   '#F9FAFB',
                  border:       '1px solid #E5E7EB',
                  outline:      'none',
                  borderRadius: 8,
                  padding:      '0 14px 0 36px',
                  fontSize:     13,
                  color:        '#111',
                  fontFamily:   font,
                  boxSizing:    'border-box',
                  transition:   'border 0.15s',
                }}
                onFocus={e => e.target.style.border = `1px solid ${COLOR.amber}`}
                onBlur={e  => e.target.style.border = '1px solid #E5E7EB'}
              />
            </div>
          </div>

          {/* Input Password */}
          <div style={{ marginBottom: 8 }}>
            <label style={{
              fontSize: 12, fontWeight: 600,
              color: '#555', fontFamily: font,
              marginBottom: 6, display: 'block',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                color="#aaa"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                style={{
                  width:        '100%',
                  height:       42,
                  background:   '#F9FAFB',
                  border:       '1px solid #E5E7EB',
                  outline:      'none',
                  borderRadius: 8,
                  padding:      '0 42px 0 36px',
                  fontSize:     13,
                  color:        '#111',
                  fontFamily:   font,
                  boxSizing:    'border-box',
                  transition:   'border 0.15s',
                }}
                onFocus={e => e.target.style.border = `1px solid ${COLOR.amber}`}
                onBlur={e  => e.target.style.border = '1px solid #E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position:   'absolute', right: 12, top: '50%',
                  transform:  'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor:     'pointer', padding: 0,
                  color:      '#aaa', display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Lupa password link */}
          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <span style={{
              fontSize: 12, color: COLOR.amber,
              fontFamily: font, cursor: 'pointer',
              fontWeight: 500,
            }}>
              Lupa Password?
            </span>
          </div>

          {/* Tombol Masuk */}
          <button
            onClick={handleSubmit}
            disabled={isDisabled || isLoading}
            style={{
              width:          '100%',
              height:         44,
              background:     isDisabled || isLoading
                ? 'linear-gradient(90deg, #FFCF80, #FFB84D)'
                : 'linear-gradient(90deg, #FFA500, #FF8C00)',
              border:         'none',
              borderRadius:   10,
              fontSize:       14,
              fontWeight:     700,
              color:          '#fff',
              cursor:         isDisabled || isLoading ? 'not-allowed' : 'pointer',
              fontFamily:     font,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            8,
              boxShadow:      isDisabled || isLoading ? 'none' : '0 4px 12px rgba(255,140,0,0.35)',
              transition:     'all 0.15s',
              marginBottom:   32,
            }}
          >
            {isLoading ? (
              <span style={{ fontSize: 13 }}>Memuat...</span>
            ) : (
              <>
                Masuk ke Dashboard
                <LogIn size={16} />
              </>
            )}
          </button>



          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: 11, color: '#aaa', fontFamily: font }}>
            &copy; 2026 ElangAnugerah POS<br />
            Sistem Manajemen Aki Terpercaya v1.0
          </div>
        </div>
      </div>

      {/* Responsive: sembunyikan panel kiri di layar kecil */}
      <style>{`
        @media (max-width: 640px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; border-radius: 16px !important; }
        }
      `}</style>
    </div>
  )
}