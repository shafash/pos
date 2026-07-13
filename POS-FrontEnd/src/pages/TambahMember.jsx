import { useState } from 'react'
import { Save, Info, Loader } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useIsMobile } from '../hooks/useIsMobile'
import { memberService } from '../services/api'
import { useMutation } from '../hooks/useApi'

const font = "'Geist', sans-serif"

// Mapping label UI → value backend
const memberTypeOptions = [
  { label: 'Reguler', value: 'reguler' },
  { label: 'VIP',     value: 'vip'     },
  { label: 'Grosir',  value: 'grosir'  },
]

export default function TambahMember({ onNav }) {
  const [fullName,    setFullName]    = useState('')
  const [phoneCode,   setPhoneCode]   = useState('+62')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email,       setEmail]       = useState('')
  const [address,     setAddress]     = useState('')
  const [memberType,  setMemberType]  = useState('reguler')
  const [errorMsg,    setErrorMsg]    = useState(null)
  const [successMsg,  setSuccessMsg]  = useState(null)

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  const { loading: loadingSimpan, execute: simpanMember } = useMutation(memberService.create)

  // Validasi minimal: nama dan telepon wajib, email opsional
  const noTeleponGabung = `${phoneCode}${phoneNumber}`.replace(/\s/g, '')
  const isSubmitDisabled = loadingSimpan || !fullName.trim() || !phoneNumber.trim()

  // ── Handler simpan ────────────────────────────────────────
  const handleSimpan = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    // Validasi frontend
    if (!fullName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.')
      return
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Nomor telepon wajib diisi.')
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Format email tidak valid.')
      return
    }

    try {
      const result = await simpanMember({
        nama_member:  fullName.trim(),
        no_telepon:   noTeleponGabung,
        email:        email.trim() || null,
        alamat:       address.trim() || null,
        tipe_member:  memberType,
      })

      setSuccessMsg(`Member "${result.nama_member}" berhasil ditambahkan dengan ID ${result.id_member}!`)

      // Reset form
      setFullName('')
      setPhoneCode('+62')
      setPhoneNumber('')
      setEmail('')
      setAddress('')
      setMemberType('reguler')

      // Redirect ke halaman member setelah 1.5 detik
      setTimeout(() => onNav('member'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message
        ?? err.response?.data?.errors
        ?? 'Gagal menyimpan member. Cek kembali data yang diisi.'
      setErrorMsg(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg)
    }
  }

  const handleBatalkan = () => {
    setFullName('')
    setPhoneCode('+62')
    setPhoneNumber('')
    setEmail('')
    setAddress('')
    setMemberType('reguler')
    setErrorMsg(null)
    onNav('member')
  }

  // ── Shared styles ─────────────────────────────────────────
  const inputStyle = {
    width:        '100%',
    background:   '#FBFBFB',
    border:       'none',
    outline:      'none',
    borderRadius: 8,
    padding:      '8px 12px',
    fontSize:     13,
    color:        COLOR.text,
    fontFamily:   font,
    boxSizing:    'border-box',
  }

  const labelStyle = {
    fontSize:     13,
    fontWeight:   400,
    color:        COLOR.text,
    fontFamily:   font,
    width:        isStacked ? '100%' : 100,
    flexShrink:   0,
    paddingTop:   isStacked ? 0 : 8,
    marginBottom: isStacked ? 6 : 0,
    display:      isStacked ? 'block' : undefined,
  }

  const rowStyle = {
    display:       'flex',
    flexDirection: isStacked ? 'column' : 'row',
    alignItems:    isStacked ? 'stretch' : 'flex-start',
    gap:           isStacked ? 0 : 12,
    marginBottom:  isStacked ? 16 : 12,
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{
      background:   '#fff',
      borderRadius: 8,
      overflow:     'hidden',
      border:       `1px solid ${COLOR.border}`,
      fontFamily:   font,
      maxWidth:     760,
      margin:       '0 auto',
    }}>

      {/* Banner */}
      <div style={{
        background: '#FFCD71',
        padding:    isMobile ? '12px 16px' : '12px 18px',
        fontSize:   15,
        fontWeight: 500,
        color:      '#000',
        fontFamily: font,
      }}>
        Tambah Member Baru
      </div>

      <div style={{ padding: isMobile ? '14px 16px 18px' : '16px 18px 20px' }}>

        {/* Toast sukses / error */}
        {successMsg && (
          <div style={{
            background:   '#DCFCE7', border: '1px solid #86EFAC',
            borderRadius: 8, padding: '10px 14px',
            fontSize: 13, color: '#16A34A', fontFamily: font,
            marginBottom: 16,
          }}>
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{
            background:   '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 8, padding: '10px 14px',
            fontSize: 13, color: '#DC2626', fontFamily: font,
            marginBottom: 16,
          }}>
            {errorMsg}
          </div>
        )}

        {/* ID Member (auto-generated) */}
        <div style={rowStyle}>
          <label style={labelStyle}>ID Member</label>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              ...inputStyle,
              color:      COLOR.textMuted,
              display:    'flex',
              alignItems: 'center',
            }}>
              Auto-generated (MBR-XXXX)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <Info size={12} color={COLOR.textMuted} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: COLOR.textMuted, fontFamily: font }}>
                ID akan dibuat otomatis oleh sistem saat disimpan.
              </span>
            </div>
          </div>
        </div>

        {/* Nama lengkap */}
        <div style={rowStyle}>
          <label style={labelStyle}>
            Nama Lengkap <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => { setFullName(e.target.value); setErrorMsg(null) }}
            placeholder="Masukkan Nama Lengkap"
            style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          />
        </div>

        {/* No telepon */}
        <div style={rowStyle}>
          <label style={labelStyle}>
            No Telepon <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={phoneCode}
              onChange={e => setPhoneCode(e.target.value)}
              style={{ ...inputStyle, width: 60, textAlign: 'center', flex: 'none', padding: '8px 6px' }}
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => { setPhoneNumber(e.target.value); setErrorMsg(null) }}
              placeholder="81234567890"
              style={{ ...inputStyle, flex: 1, minWidth: 0 }}
            />
          </div>
        </div>

        {/* Email (opsional) */}
        <div style={rowStyle}>
          <label style={labelStyle}>
            Email{' '}
            <span style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 400 }}>
              (opsional)
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrorMsg(null) }}
            placeholder="example@gmail.com"
            style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          />
        </div>

        {/* Alamat (opsional) */}
        <div style={rowStyle}>
          <label style={labelStyle}>
            Alamat{' '}
            <span style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 400 }}>
              (opsional)
            </span>
          </label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Jl. XXXXXXX"
            style={{
              ...inputStyle,
              flex:     1,
              minWidth: 0,
              height:   80,
              resize:   'vertical',
            }}
          />
        </div>

        {/* Tipe member */}
        <div style={rowStyle}>
          <label style={labelStyle}>Tipe Member</label>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: isMobile ? 8 : 12 }}>
            {memberTypeOptions.map(({ label, value }) => {
              const isActive = memberType === value
              return (
                <button
                  key={value}
                  onClick={() => setMemberType(value)}
                  style={{
                    flex:         1,
                    padding:      '8px 0',
                    borderRadius: 8,
                    border:       isActive ? '1.5px solid #FFA500' : 'none',
                    background:   isActive ? '#fff' : '#FBFBFB',
                    color:        isActive ? '#FFA500' : COLOR.textMuted,
                    fontWeight:   500,
                    fontSize:     isMobile ? 13 : 14,
                    cursor:       'pointer',
                    fontFamily:   font,
                    transition:   'all 0.15s',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Info tier awal */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          6,
          marginBottom: isStacked ? 8 : 20,
          marginTop:    -4,
        }}>
          <Info size={12} color={COLOR.textMuted} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: COLOR.textMuted, fontFamily: font }}>
            Member baru otomatis masuk tier <strong>Bronze</strong> dengan 0 poin. Tier naik sesuai akumulasi transaksi.
          </span>
        </div>

        {/* Tombol aksi */}
        <div style={{
          display:        'flex',
          justifyContent: 'flex-end',
          gap:            isMobile ? 10 : 12,
          marginTop:      isStacked ? 8 : 0,
        }}>
          <button
            onClick={handleBatalkan}
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
            disabled={isSubmitDisabled}
            style={{
              width:          isMobile ? undefined : 160,
              flex:           isMobile ? 1 : undefined,
              height:         isMobile ? 36 : 40,
              background:     isSubmitDisabled ? '#FFCF80' : '#FFA500',
              border:         'none',
              borderRadius:   8,
              fontSize:       isMobile ? 12 : 13,
              fontWeight:     600,
              color:          isSubmitDisabled ? 'rgba(255,255,255,0.8)' : '#fff',
              cursor:         isSubmitDisabled ? 'not-allowed' : 'pointer',
              fontFamily:     font,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            isMobile ? 6 : 8,
              whiteSpace:     'nowrap',
            }}
          >
            {loadingSimpan
              ? <Loader size={isMobile ? 14 : 16} color="rgba(255,255,255,0.8)" />
              : <Save size={isMobile ? 14 : 16} />
            }
            {loadingSimpan ? 'Menyimpan...' : 'Simpan Member'}
          </button>
        </div>
      </div>
    </div>
  )
}