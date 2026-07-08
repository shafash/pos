import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
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
      // Login sukses → AuthContext sudah set user & token
      // App.jsx akan deteksi user sudah ada dan redirect otomatis
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
      background:     COLOR.bg,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     font,
      padding:        '16px',
      boxSizing:      'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* ── Logo / Brand ─────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display:        'inline-flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          52,
            height:         52,
            background:     COLOR.amber,
            borderRadius:   14,
            marginBottom:   14,
          }}>
            <span style={{
              color:         '#fff',
              fontWeight:    900,
              fontSize:      22,
              fontFamily:    font,
              letterSpacing: -1,
            }}>EA</span>
          </div>
          <div style={{
            fontSize:     22,
            fontWeight:   700,
            color:        COLOR.text,
            fontFamily:   font,
            marginBottom: 4,
          }}>
            POS Elang Anugerah
          </div>
          <div style={{ fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>
            Masuk ke akun Anda untuk melanjutkan
          </div>
        </div>

        {/* ── Card Login ───────────────────────── */}
        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          overflow:     'hidden',
        }}>

          {/* Banner */}
          <div style={{
            background: COLOR.accentLight,
            padding:    '14px 20px',
            fontSize:   14,
            fontWeight: 600,
            color:      COLOR.text,
            fontFamily: font,
          }}>
            Login Akun
          </div>

          {/* Form */}
          <div style={{ padding: '24px 20px' }}>

            {/* Error message */}
            {error && (
              <div style={{
                background:   '#FFECEC',
                border:       `1px solid ${COLOR.red}`,
                borderRadius: 8,
                padding:      '10px 14px',
                fontSize:     13,
                color:        COLOR.red,
                fontFamily:   font,
                marginBottom: 18,
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize:     13,
                fontWeight:   500,
                color:        COLOR.text,
                fontFamily:   font,
                marginBottom: 6,
                display:      'block',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="admin@elanganugerah.com"
                style={{
                  width:        '100%',
                  height:       42,
                  background:   '#FBFBFB',
                  border:       `1px solid ${COLOR.border}`,
                  outline:      'none',
                  borderRadius: 8,
                  padding:      '0 14px',
                  fontSize:     13,
                  color:        COLOR.text,
                  fontFamily:   font,
                  boxSizing:    'border-box',
                  transition:   'border 0.15s',
                }}
                onFocus={e => e.target.style.border = `1px solid ${COLOR.amber}`}
                onBlur={e  => e.target.style.border = `1px solid ${COLOR.border}`}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontSize:     13,
                fontWeight:   500,
                color:        COLOR.text,
                fontFamily:   font,
                marginBottom: 6,
                display:      'block',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={handleKeyDown}
                  placeholder="Masukkan password"
                  style={{
                    width:        '100%',
                    height:       42,
                    background:   '#FBFBFB',
                    border:       `1px solid ${COLOR.border}`,
                    outline:      'none',
                    borderRadius: 8,
                    padding:      '0 42px 0 14px',
                    fontSize:     13,
                    color:        COLOR.text,
                    fontFamily:   font,
                    boxSizing:    'border-box',
                    transition:   'border 0.15s',
                  }}
                  onFocus={e => e.target.style.border = `1px solid ${COLOR.amber}`}
                  onBlur={e  => e.target.style.border = `1px solid ${COLOR.border}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position:       'absolute',
                    right:          12,
                    top:            '50%',
                    transform:      'translateY(-50%)',
                    background:     'none',
                    border:         'none',
                    cursor:         'pointer',
                    padding:        0,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          COLOR.textMuted,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isDisabled || isLoading}
              style={{
                width:          '100%',
                height:         44,
                background:     isDisabled || isLoading ? '#FFCF80' : COLOR.amber,
                border:         'none',
                borderRadius:   8,
                fontSize:       14,
                fontWeight:     700,
                color:          isDisabled || isLoading ? 'rgba(255,255,255,0.8)' : '#fff',
                cursor:         isDisabled || isLoading ? 'not-allowed' : 'pointer',
                fontFamily:     font,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            8,
                transition:     'background 0.15s',
              }}
            >
              {isLoading ? (
                <span style={{ fontSize: 13 }}>Memuat...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  Masuk
                </>
              )}
            </button>

            {/* Hint akun testing */}
            <div style={{
              marginTop:    16,
              padding:      '10px 14px',
              background:   '#FFFBEB',
              border:       `1px solid #FDE68A`,
              borderRadius: 8,
              fontSize:     11,
              color:        '#92400E',
              fontFamily:   font,
              lineHeight:   1.6,
            }}>
              <strong>Akun testing:</strong><br />
              Admin: admin@elanganugerah.com<br />
              Kasir Blimbing: kasir.blimbing@elanganugerah.com<br />
              Password semua: <strong>password123</strong>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────── */}
        <div style={{
          textAlign:  'center',
          marginTop:  24,
          fontSize:   12,
          color:      COLOR.textMuted,
          fontFamily: font,
        }}>
          &copy; 2026 Elang Anugerah. All rights reserved.
        </div>
      </div>
    </div>
  )
}