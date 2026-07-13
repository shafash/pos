import { useState, useEffect } from 'react'
import { Save, CheckCircle, Loader } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useIsMobile } from '../hooks/useIsMobile'
import { memberService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'

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

// Helper: label tier loyalty
function tierLabel(tier) {
  const map = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' }
  return map[tier] ?? tier ?? '-'
}

// Helper: poin untuk naik tier berikutnya
function nextTierInfo(poin) {
  if (poin >= 10000) return { label: 'MAX TIER', persen: 100 }
  if (poin >= 7000)  return { label: `${10000 - poin} poin lagi → Platinum`, persen: Math.round(((poin - 7000) / 3000) * 100) }
  if (poin >= 3000)  return { label: `${7000 - poin} poin lagi → Gold`, persen: Math.round(((poin - 3000) / 4000) * 100) }
  return { label: `${3000 - poin} poin lagi → Silver`, persen: Math.round((poin / 3000) * 100) }
}

export default function EditMember({ onNav, params }) {
  const idMember = params?.id_member

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  // ── State form ───────────────────────────────────────────
  const [formData, setFormData] = useState({
    nama_member: '',
    no_telepon:  '',
    email:       '',
    alamat:      '',
  })

  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg,   setErrorMsg]   = useState(null)

  // ── API hooks ────────────────────────────────────────────
  const { data: member, loading: loadingMember, execute: fetchMember } = useApi(memberService.getById)
  const { loading: loadingSimpan, execute: simpanMember } = useMutation(memberService.update)

  // ── Fetch data member saat dibuka ────────────────────────
  useEffect(() => {
    if (idMember) fetchMember(idMember)
  }, [idMember])

  // Isi form setelah data member ke-load
  useEffect(() => {
    if (!member) return
    setFormData({
      nama_member: member.nama_member ?? '',
      no_telepon:  member.no_telepon  ?? '',
      email:       member.email       ?? '',
      alamat:      member.alamat      ?? '',
    })
  }, [member])

  // ── Derived values ───────────────────────────────────────
  const poin         = member?.poin ?? 0
  const tier         = member?.tier_loyalty ?? 'bronze'
  const { label: nextLabel, persen: nextPersen } = nextTierInfo(poin)
  const tahunBergabung = member?.tanggal_bergabung
    ? new Date(member.tanggal_bergabung).getFullYear()
    : '-'

  // ── Handlers ─────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSimpan = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    try {
      await simpanMember(idMember, {
        nama_member: formData.nama_member,
        no_telepon:  formData.no_telepon,
        email:       formData.email || null,
        alamat:      formData.alamat || null,
      })
      setSuccessMsg('Data member berhasil diperbarui!')
      setTimeout(() => onNav('member'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message
        ?? err.response?.data?.errors
        ?? 'Gagal menyimpan perubahan.'
      setErrorMsg(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg)
    }
  }

  // ── Guard: id_member tidak ada ───────────────────────────
  if (!idMember) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font, fontSize: 13 }}>
        ID Member tidak ditemukan. Kembali ke halaman Data Member dan pilih member yang ingin diedit.
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => onNav('member')}
            style={{ color: COLOR.amber, background: 'none', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: font }}
          >
            ← Kembali ke Data Member
          </button>
        </div>
      </div>
    )
  }

  // ── Loading state ─────────────────────────────────────────
  if (loadingMember) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font }}>
        <Loader size={24} color={COLOR.amber} />
        <div style={{ marginTop: 12, fontSize: 13 }}>Memuat data member...</div>
      </div>
    )
  }

  if (!member && !loadingMember) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font, fontSize: 13 }}>
        Member <strong>{idMember}</strong> tidak ditemukan.
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => onNav('member')}
            style={{ color: COLOR.amber, background: 'none', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: font }}
          >
            ← Kembali ke Data Member
          </button>
        </div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
    <div style={{
      display:             'grid',
      gridTemplateColumns: isStacked ? '1fr' : '1fr 320px',
      gap:                 isMobile ? 14 : 16,
      fontFamily:          font,
    }}>

      {/* ── Kolom kiri: form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toast sukses / error */}
        {successMsg && (
          <div style={{
            background: '#DCFCE7', border: '1px solid #86EFAC',
            borderRadius: 8, padding: '10px 14px',
            fontSize: 13, color: '#16A34A', fontFamily: font,
          }}>
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 8, padding: '10px 14px',
            fontSize: 13, color: '#DC2626', fontFamily: font,
          }}>
            {errorMsg}
          </div>
        )}

        <div style={cardStyle}>
          <div style={bannerStyle}>Informasi Member</div>
          <div style={{ padding: isMobile ? '14px' : '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Nama lengkap */}
            <div>
              <label style={labelStyle}>Nama Lengkap</label>
              <input
                type="text"
                value={formData.nama_member}
                onChange={handleChange('nama_member')}
                style={inputStyle}
              />
            </div>

            {/* Member ID & Tanggal Bergabung (readonly) */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Member ID</label>
                <input
                  type="text"
                  value={member?.id_member ?? ''}
                  disabled
                  style={{
                    ...inputStyle,
                    border:   `1px solid ${COLOR.amber}`,
                    opacity:  0.7,
                    cursor:   'not-allowed',
                  }}
                />
                <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 4, fontFamily: font }}>
                  ID Member tidak bisa diubah.
                </div>
              </div>
              <div>
                <label style={labelStyle}>Tanggal Bergabung</label>
                <input
                  type="text"
                  value={member?.tanggal_bergabung ?? ''}
                  disabled
                  style={{
                    ...inputStyle,
                    border:  `1px solid ${COLOR.amber}`,
                    opacity: 0.7,
                    cursor:  'not-allowed',
                  }}
                />
              </div>
            </div>

            {/* Nomor telepon */}
            <div>
              <label style={labelStyle}>Nomor Telepon</label>
              <input
                type="tel"
                value={formData.no_telepon}
                onChange={handleChange('no_telepon')}
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
                placeholder="(opsional)"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Kolom kanan: loyalty + alamat + tombol ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Loyalty & Tiering */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Loyalty &amp; Tiering</div>
          <div style={{ padding: '14px' }}>

            {/* Saldo poin */}
            <div style={{
              background:   COLOR.amberLight,
              borderRadius: 8,
              padding:      '12px',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.amberDark, fontFamily: font, marginBottom: 6 }}>
                Saldo Poin Saat Ini
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: '#000', fontFamily: font, lineHeight: 1 }}>
                  {poin.toLocaleString('id-ID')}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLOR.amber, fontFamily: font }}>
                  Points
                </span>
              </div>

              {/* Progress bar ke tier berikutnya */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height:     '100%',
                    width:      `${nextPersen}%`,
                    background: COLOR.amber,
                    borderRadius: 4,
                    transition: 'width 0.4s',
                  }} />
                </div>
                <div style={{ fontSize: 10, color: COLOR.amberDark, marginTop: 4, fontFamily: font }}>
                  {nextLabel}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: COLOR.amberDark, fontFamily: font, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                  MEMBER SEJAK: {tahunBergabung}
                </span>
                {poin < 10000 && (
                  <div style={{
                    background:   '#fff',
                    borderRadius: 4,
                    padding:      '2px 6px',
                    fontSize:     10,
                    fontWeight:   600,
                    color:        COLOR.amberDark,
                    fontFamily:   font,
                    border:       `1px solid ${COLOR.amber}`,
                    whiteSpace:   'nowrap',
                    flexShrink:   0,
                  }}>
                    LEVEL UP SOON
                  </div>
                )}
              </div>
            </div>

            {/* Status tier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width:          36, height: 36,
                borderRadius:   '50%',
                border:         `1.5px solid ${COLOR.amber}`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
                background:     COLOR.amberLight,
              }}>
                <CheckCircle size={18} color={COLOR.amber} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#000', fontFamily: font, marginBottom: 4 }}>
                  Status Member
                </div>
                <div style={{
                  background:   COLOR.amberLight,
                  border:       `1px solid ${COLOR.amber}`,
                  borderRadius: 6,
                  padding:      '2px 10px',
                  fontSize:     11,
                  fontWeight:   600,
                  color:        COLOR.amberDark,
                  fontFamily:   font,
                  display:      'inline-block',
                }}>
                  {tierLabel(tier)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alamat */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Alamat</div>
          <div style={{ padding: '14px' }}>
            <textarea
              value={formData.alamat}
              onChange={handleChange('alamat')}
              placeholder="Alamat lengkap (opsional)"
              rows={3}
              style={{
                ...inputStyle,
                height:     'auto',
                padding:    '10px 12px',
                resize:     'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* Tombol aksi */}
        <div style={{
          display:        'flex',
          justifyContent: 'flex-end',
          gap:            isMobile ? 8 : 10,
          marginTop:      4,
        }}>
          <button
            onClick={() => onNav('member')}
            disabled={loadingSimpan}
            style={{
              width:        isMobile ? undefined : 110,
              flex:         isMobile ? 1 : undefined,
              height:       isMobile ? 36 : 40,
              background:   '#F4F5F7',
              border:       'none',
              borderRadius: 8,
              fontSize:     isMobile ? 12 : 13,
              fontWeight:   600,
              color:        COLOR.textMuted,
              cursor:       'pointer',
              fontFamily:   font,
            }}
          >
            Batalkan
          </button>
          <button
            onClick={handleSimpan}
            disabled={loadingSimpan}
            style={{
              width:          isMobile ? undefined : 160,
              flex:           isMobile ? 1 : undefined,
              height:         isMobile ? 36 : 40,
              background:     loadingSimpan ? COLOR.border : COLOR.amber,
              border:         'none',
              borderRadius:   8,
              fontSize:       isMobile ? 12 : 13,
              fontWeight:     600,
              color:          loadingSimpan ? COLOR.textMuted : '#fff',
              cursor:         loadingSimpan ? 'not-allowed' : 'pointer',
              fontFamily:     font,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            isMobile ? 6 : 8,
              whiteSpace:     'nowrap',
            }}
          >
            {loadingSimpan ? <Loader size={isMobile ? 14 : 16} color="#fff" /> : <Save size={isMobile ? 14 : 16} />}
            {loadingSimpan ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}