import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useIsMobile } from '../hooks/useIsMobile'
import { produkService, kategoriService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'

const font = "'Geist', sans-serif"

const inputStyle = {
  width:        '100%',
  height:       40,
  background:   '#FBFBFB',
  border:       'none',
  outline:      'none',
  borderRadius: 8,
  padding:      '0 18px',
  fontSize:     13,
  color:        COLOR.textMuted,
  fontFamily:   font,
  boxSizing:    'border-box',
}

const labelStyle = {
  fontSize:     13,
  fontWeight:   400,
  color:        '#000',
  fontFamily:   font,
  marginBottom: 6,
  display:      'block',
}

const cardStyle = {
  background:   '#fff',
  borderRadius: 8,
  border:       `1px solid ${COLOR.border}`,
  overflow:     'hidden',
}

const bannerStyle = {
  background: '#FFCD71',
  padding:    '16px 22px',
  fontSize:   16,
  fontWeight: 500,
  color:      '#000',
  fontFamily: font,
}

export default function EditBarang({ onNav, params }) {
  const { user }     = useAuth()
  const cabangId     = user?.cabang_id ?? 1
  const sku          = params?.sku      // SKU produk yang diedit, dikirim dari StokBarang

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  // ── State form ───────────────────────────────────────────
  const [formData, setFormData] = useState({
    nama_barang:  '',
    sku:          '',
    kategori_id:  '',
    merek:        '',
    satuan:       'Pcs',
    harga_beli:   '',
    harga_eceran: '',
    harga_grosir: '',
  })

  // Stok per cabang — disimpan terpisah dari formData produk
  const [stokForm, setStokForm] = useState({
    stok_saat_ini: '',
    minimum_stok:  '',
  })

  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg,   setErrorMsg]   = useState(null)

  // ── API hooks ────────────────────────────────────────────
  const { data: produk,    loading: loadingProduk,   execute: fetchProduk   } = useApi(produkService.getById)
  const { data: kategoriList, loading: loadingKategori, execute: fetchKategori } = useApi(kategoriService.getAll)
  const { loading: loadingUpdate, execute: updateProduk } = useMutation(produkService.update)
  const { loading: loadingStok,   execute: updateStok   } = useMutation(produkService.updateStok)

  // ── Fetch data saat halaman dibuka ───────────────────────
  useEffect(() => {
    fetchKategori()
    if (sku) {
      fetchProduk(sku)
    }
  }, [sku])

  // Setelah produk ke-load, isi form dengan data yang ada
  useEffect(() => {
    if (!produk) return
    setFormData({
      nama_barang:  produk.nama_barang  ?? '',
      sku:          produk.sku          ?? '',
      kategori_id:  produk.kategori_id  ?? '',
      merek:        produk.merek        ?? '',
      satuan:       produk.satuan       ?? 'Pcs',
      harga_beli:   produk.harga_beli   ?? '',
      harga_eceran: produk.harga_eceran ?? '',
      harga_grosir: produk.harga_grosir ?? '',
    })

    // Stok: ambil dari cabang user yang login
    const stokCabangIni = produk.stok_per_cabang?.find(s => s.cabang_id === cabangId)
    setStokForm({
      stok_saat_ini: stokCabangIni?.stok_saat_ini ?? 0,
      minimum_stok:  stokCabangIni?.minimum_stok  ?? 0,
    })
  }, [produk, cabangId])

  // ── Derived values dari data produk ─────────────────────
  const totalStok      = produk?.stok_per_cabang?.reduce((s, c) => s + (c.stok_saat_ini ?? 0), 0) ?? 0
  const stokCabangIni  = produk?.stok_per_cabang?.find(s => s.cabang_id === cabangId)
  const statusStok     = stokCabangIni
    ? stokCabangIni.perlu_restock ? 'Perlu Restock' : 'Stok Aman'
    : '-'
  const statusStokColor = stokCabangIni?.perlu_restock ? '#DC2626' : '#734A00'
  const statusStokBg    = stokCabangIni?.perlu_restock ? '#FEF2F2'  : '#FFF7E8'

  // ── Handlers ─────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleStokChange = (field) => (e) => {
    setStokForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSimpan = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // 1. Update data produk (nama, merek, harga, kategori, satuan)
      await updateProduk(sku, {
        nama_barang:  formData.nama_barang,
        kategori_id:  parseInt(formData.kategori_id),
        merek:        formData.merek,
        satuan:       formData.satuan,
        harga_beli:   parseFloat(formData.harga_beli),
        harga_eceran: parseFloat(formData.harga_eceran),
        harga_grosir: parseFloat(formData.harga_grosir) || null,
      })

      // 2. Update stok di cabang user yang login
      await updateStok(sku, {
        cabang_id:     cabangId,
        stok_saat_ini: parseInt(stokForm.stok_saat_ini) || 0,
        minimum_stok:  parseInt(stokForm.minimum_stok)  || 0,
      })

      setSuccessMsg('Produk berhasil diperbarui!')
      setTimeout(() => onNav('stok'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message
        ?? err.response?.data?.errors
        ?? 'Gagal menyimpan perubahan. Cek kembali data yang diisi.'
      setErrorMsg(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg)
    }
  }

  // ── Loading state awal ───────────────────────────────────
  if (!sku) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font, fontSize: 13 }}>
        SKU produk tidak ditemukan. Kembali ke halaman Stok Barang dan pilih produk yang ingin diedit.
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => onNav('stok')}
            style={{ color: COLOR.amber, background: 'none', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: font }}
          >
            ← Kembali ke Stok Barang
          </button>
        </div>
      </div>
    )
  }

  if (loadingProduk) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font }}>
        <Loader size={24} color={COLOR.amber} />
        <div style={{ marginTop: 12, fontSize: 13 }}>Memuat data produk...</div>
      </div>
    )
  }

  if (!produk && !loadingProduk) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font, fontSize: 13 }}>
        Produk dengan SKU <strong>{sku}</strong> tidak ditemukan.
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => onNav('stok')}
            style={{ color: COLOR.amber, background: 'none', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: font }}
          >
            ← Kembali ke Stok Barang
          </button>
        </div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 20, fontFamily: font }}>

      {/* Success / Error toast */}
      {successMsg && (
        <div style={{
          background: '#DCFCE7', border: '1px solid #86EFAC',
          borderRadius: 8, padding: '10px 16px',
          fontSize: 13, color: '#16A34A', fontFamily: font,
        }}>
          ✓ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 8, padding: '10px 16px',
          fontSize: 13, color: '#DC2626', fontFamily: font,
        }}>
          {errorMsg}
        </div>
      )}

      {/* ── Row 1: Foto + Informasi Dasar ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: isStacked ? '1fr' : '386px 1fr',
        gap:                 isMobile ? 16 : 20,
      }}>

        {/* Foto produk */}
        <div style={cardStyle}>
          <div style={{ padding: isMobile ? '20px 18px' : '28px 24px' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#000', fontFamily: font, marginBottom: 20 }}>
              Foto Produk
            </div>
            <div style={{
              width:          203, height: 203,
              background:     '#1A3A0A',
              borderRadius:   8,
              margin:         '0 auto 16px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, fontFamily: font }}>
                {(formData.merek || formData.nama_barang).substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>
              Format: JPG, PNG (Maks. 2MB)
            </div>
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 11, color: COLOR.textMuted, fontFamily: font }}>
              SKU: <strong style={{ color: COLOR.amber }}>{formData.sku}</strong>
            </div>
          </div>
        </div>

        {/* Informasi dasar */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Informasi Dasar</div>
          <div style={{ padding: isMobile ? '16px 18px' : '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={labelStyle}>Nama Barang</label>
              <input
                type="text"
                value={formData.nama_barang}
                onChange={handleChange('nama_barang')}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Kode SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  disabled
                  style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                />
                <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 4, fontFamily: font }}>
                  SKU tidak bisa diubah setelah produk dibuat.
                </div>
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                {loadingKategori ? (
                  <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Loader size={14} color={COLOR.amber} /> Memuat...
                  </div>
                ) : (
                  <select
                    value={formData.kategori_id}
                    onChange={handleChange('kategori_id')}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {(kategoriList ?? []).map(k => (
                      <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Merek</label>
                <input
                  type="text"
                  value={formData.merek}
                  onChange={handleChange('merek')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Satuan</label>
                <input
                  type="text"
                  value={formData.satuan}
                  onChange={handleChange('satuan')}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Status Inventaris + Harga & Stok ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: isStacked ? '1fr' : '386px 1fr',
        gap:                 isMobile ? 16 : 20,
      }}>

        {/* Status inventaris */}
        <div style={cardStyle}>
          <div style={{ padding: isMobile ? '16px 18px' : '18px 24px' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#000', fontFamily: font, marginBottom: 20 }}>
              Status Inventaris
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLOR.border}` }}>
              <span style={{ fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>Tersedia (semua cabang)</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#000', fontFamily: font }}>
                {totalStok} Unit
              </span>
            </div>

            {/* Stok per cabang */}
            {(produk?.stok_per_cabang ?? []).map((s, i, arr) => (
              <div key={s.cabang_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${COLOR.border}` : 'none',
              }}>
                <span style={{ fontSize: 12, color: COLOR.textMuted, fontFamily: font }}>
                  {s.nama_cabang?.replace('Elang Anugerah ', '') ?? `Cabang ${s.cabang_id}`}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600, fontFamily: font,
                  color: s.perlu_restock ? '#DC2626' : '#000',
                }}>
                  {s.stok_saat_ini} Unit {s.perlu_restock ? '⚠' : ''}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 0' }}>
              <span style={{ fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>Status Stok (cabang ini)</span>
              <div style={{
                background:   statusStokBg,
                borderRadius: 5,
                padding:      '3px 10px',
                fontSize:     11,
                fontWeight:   500,
                color:        statusStokColor,
                fontFamily:   font,
              }}>
                {statusStok}
              </div>
            </div>
          </div>
        </div>

        {/* Harga & Stok */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Harga &amp; Stok</div>
          <div style={{ padding: isMobile ? '16px 18px' : '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Harga Beli (Modal)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.harga_beli}
                  onChange={handleChange('harga_beli')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Harga Jual (Eceran)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.harga_eceran}
                  onChange={handleChange('harga_eceran')}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Harga Grosir</label>
                <input
                  type="number"
                  min={0}
                  value={formData.harga_grosir}
                  onChange={handleChange('harga_grosir')}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', fontFamily: font, marginBottom: 14 }}>
                Stok Cabang Ini ({user?.cabang ?? 'Cabang Anda'})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Stok Saat Ini</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={stokForm.stok_saat_ini}
                    onChange={handleStokChange('stok_saat_ini')}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Minimum Stok (Peringatan)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={stokForm.minimum_stok}
                    onChange={handleStokChange('minimum_stok')}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 8, fontFamily: font }}>
                Perubahan stok hanya berlaku untuk cabang kamu. Untuk cabang lain, lakukan dari akun kasir masing-masing.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tombol aksi ── */}
      <div style={{ display: 'flex', justifyContent: isStacked ? undefined : 'flex-end', gap: isMobile ? 12 : 16 }}>
        <button
          onClick={() => onNav('stok')}
          disabled={loadingUpdate || loadingStok}
          style={{
            width:        isStacked ? undefined : 152,
            flex:         isStacked ? 1 : undefined,
            height:       isMobile ? 48 : 56,
            background:   '#F4F5F7',
            border:       'none',
            borderRadius: 8,
            fontSize:     isMobile ? 14 : 17,
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
          disabled={loadingUpdate || loadingStok}
          style={{
            width:          isStacked ? undefined : 253,
            flex:           isStacked ? 1 : undefined,
            height:         isMobile ? 48 : 56,
            background:     loadingUpdate || loadingStok ? COLOR.border : '#FFA500',
            border:         'none',
            borderRadius:   8,
            fontSize:       isMobile ? 14 : 17,
            fontWeight:     600,
            color:          loadingUpdate || loadingStok ? COLOR.textMuted : '#fff',
            cursor:         loadingUpdate || loadingStok ? 'not-allowed' : 'pointer',
            fontFamily:     font,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            isMobile ? 6 : 10,
          }}
        >
          {(loadingUpdate || loadingStok) ? <Loader size={isMobile ? 16 : 18} color="#fff" /> : <Save size={isMobile ? 16 : 18} />}
          {loadingUpdate || loadingStok ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
    </div>
  )
}