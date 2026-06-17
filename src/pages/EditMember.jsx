import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { COLOR } from '../constants/colors'

const font = "'Geist', sans-serif"

const bannerStyle = {
  background:   '#FFCD71',
  padding:      '12px 16px',
  fontSize:     14,
  fontWeight:   600,
  color:        '#000',
  fontFamily:   font,
  borderRadius: '8px 8px 0 0',
}

const cardStyle = {
  background:   '#fff',
  borderRadius: 8,
  border:       `1px solid ${COLOR.border}`,
  overflow:     'hidden',
}

const inputStyle = {
  width:        '100%',
  height:       38,
  background:   '#FBFBFB',
  border:       `1px solid ${COLOR.border}`,
  outline:      'none',
  borderRadius: 8,
  padding:      '0 12px',
  fontSize:     13,
  color:        COLOR.textMuted,
  fontFamily:   font,
  boxSizing:    'border-box',
}

const labelStyle = {
  fontSize:     12,
  fontWeight:   400,
  color:        '#000',
  fontFamily:   font,
  marginBottom: 6,
  display:      'block',
}

export default function EditMember({ onNav }) {
  const [formData, setFormData] = useState({
    namaLengkap:      'Kael Hiro',
    memberId:         'MBR-XXXX',
    tanggalBergabung: 'XX-XX-XXXX',
    nomorTelepon:     '000124567890',
    email:            'Kael@gmail.com',
  })

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, fontFamily: font }}>

      {/* ── Kolom Kiri: Informasi Member ─────── */}
      <div style={cardStyle}>
        <div style={bannerStyle}>Informasi Member</div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Nama Lengkap */}
          <div>
            <label style={labelStyle}>Nama Lengkap</label>
            <input
              type="text"
              value={formData.namaLengkap}
              onChange={handleChange('namaLengkap')}
              style={inputStyle}
            />
          </div>

          {/* Member ID + Tanggal Bergabung */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Member ID</label>
              <input
                type="text"
                value={formData.memberId}
                onChange={handleChange('memberId')}
                style={{ ...inputStyle, border: `1px solid ${COLOR.amber}` }}
              />
            </div>
            <div>
              <label style={labelStyle}>Tanggal Bergabung</label>
              <input
                type="text"
                value={formData.tanggalBergabung}
                onChange={handleChange('tanggalBergabung')}
                style={{ ...inputStyle, border: `1px solid ${COLOR.amber}` }}
              />
            </div>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label style={labelStyle}>Nomor Telepon</label>
            <input
              type="tel"
              value={formData.nomorTelepon}
              onChange={handleChange('nomorTelepon')}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* ── Kolom Kanan ──────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Loyalty & Tiering */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Loyalty &amp; Tiering</div>
          <div style={{ padding: '14px' }}>

            {/* Saldo Poin */}
            <div style={{
              background:   COLOR.amberLight,
              borderRadius: 8,
              padding:      '12px',
              marginBottom: 12,
            }}>
              <div style={{
                fontSize:     11,
                fontWeight:   600,
                color:        COLOR.amberDark,
                fontFamily:   font,
                marginBottom: 6,
              }}>
                Saldo Poin Saat Ini
              </div>
              <div style={{
                display:      'flex',
                alignItems:   'baseline',
                gap:          6,
                marginBottom: 8,
              }}>
                <span style={{
                  fontSize:   28,
                  fontWeight: 700,
                  color:      '#000',
                  fontFamily: font,
                  lineHeight: 1,
                }}>
                  1,250
                </span>
                <span style={{
                  fontSize:   12,
                  fontWeight: 600,
                  color:      COLOR.amber,
                  fontFamily: font,
                }}>
                  Points
                </span>
              </div>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
              }}>
                <span style={{
                  fontSize:      10,
                  fontWeight:    600,
                  color:         COLOR.amberDark,
                  fontFamily:    font,
                  letterSpacing: 1,
                }}>
                  MEMBER SEJAK: 2076
                </span>
                <div style={{
                  background:   '#fff',
                  borderRadius: 4,
                  padding:      '2px 6px',
                  fontSize:     10,
                  fontWeight:   600,
                  color:        COLOR.amberDark,
                  fontFamily:   font,
                  border:       `1px solid ${COLOR.amber}`,
                }}>
                  LEVEL UP SOON
                </div>
              </div>
            </div>

            {/* Status Member */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width:          36,
                height:         36,
                borderRadius:   '50%',
                border:         `1.5px solid ${COLOR.border}`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}>
                <CheckCircle size={18} color={COLOR.textMuted} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{
                  fontSize:     12,
                  fontWeight:   600,
                  color:        '#000',
                  fontFamily:   font,
                  marginBottom: 4,
                }}>
                  Status Member
                </div>
                <div style={{
                  background:   '#fff',
                  border:       `1px solid ${COLOR.border}`,
                  borderRadius: 6,
                  padding:      '2px 10px',
                  fontSize:     11,
                  fontWeight:   500,
                  color:        '#000',
                  fontFamily:   font,
                  display:      'inline-block',
                }}>
                  Platinum
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alamat */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Alamat</div>
          <div style={{ padding: '14px' }}>
            <div style={{
              fontSize:   13,
              color:      COLOR.textMuted,
              fontFamily: font,
              lineHeight: 1.6,
            }}>
              Jl. Ahmad Yani No.15, Kepanjen
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display:        'flex',
          justifyContent: 'flex-end',
          gap:            10,
          marginTop:      4,
        }}>
          <button
            onClick={() => onNav('member')}
            style={{
              width:        110,
              height:       40,
              background:   '#F4F5F7',
              border:       'none',
              borderRadius: 8,
              fontSize:     13,
              fontWeight:   600,
              color:        COLOR.textMuted,
              cursor:       'pointer',
              fontFamily:   font,
            }}
          >
            Batalkan
          </button>
          <button
            style={{
              width:          160,
              height:         40,
              background:     COLOR.amber,
              border:         'none',
              borderRadius:   8,
              fontSize:       13,
              fontWeight:     600,
              color:          '#fff',
              cursor:         'pointer',
              fontFamily:     font,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            8,
            }}
          >
            <Save size={16} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  )
}