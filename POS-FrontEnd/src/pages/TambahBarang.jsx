import { useState, useRef, useEffect } from 'react'
import { Camera, Save, Loader, X } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useIsMobile } from '../hooks/useIsMobile'
import { produkService, kategoriService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'

const font = "'Geist', sans-serif"

const initialFormState = {
  nama_barang:  '',
  sku:          '',
  kategori_id:  '',
  merek:        '',
  satuan:       'Pcs',
  harga_beli:   '',
  harga_eceran: '',
  stok_awal:    '',
  minimum_stok: '',
}

const inputStyle = {
  width: '100%', height: 40, background: '#FBFBFB',
  border: 'none', outline: 'none', borderRadius: 8,
  padding: '0 10px', fontSize: 13, color: '#000',
  fontFamily: font, boxSizing: 'border-box',
}

const labelStyle = {
  fontSize: 13, fontWeight: 400, color: '#000',
  fontFamily: font, marginBottom: 6, display: 'block',
}

const sectionTitleStyle = {
  fontSize: 15, fontWeight: 500, color: '#000',
  fontFamily: font, marginBottom: 6,
}

export default function TambahBarang({ onNav }) {
  const [formState,     setFormState]     = useState(initialFormState)
  const [fotoFile,      setFotoFile]      = useState(null)
  const [fotoPreview,   setFotoPreview]   = useState(null)
  const [fotoName,      setFotoName]      = useState('')
  const [isDragging,    setIsDragging]    = useState(false)
  const [errorMsg,      setErrorMsg]      = useState(null)
  const [successMsg,    setSuccessMsg]    = useState(null)
  const fileInputRef = useRef(null)

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  const { data: kategoriList, loading: loadingKategori, execute: fetchKategori } = useApi(kategoriService.getAll)
  const { loading: loadingSimpan, execute: simpanProduk } = useMutation(
    (data) => produkService.create(data, fotoFile)
  )

  useEffect(() => {
    fetchKategori()
  }, [])

  useEffect(() => {
    if (kategoriList && kategoriList.length > 0 && !formState.kategori_id) {
      setFormState(prev => ({ ...prev, kategori_id: kategoriList[0].id }))
    }
  }, [kategoriList])

  const handleChange = (field) => (e) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }))
    setErrorMsg(null)
  }

  const handleFotoSelect = (file) => {
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setErrorMsg('Format foto harus JPG atau PNG.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ukuran foto maksimal 2MB.')
      return
    }
    setFotoFile(file)
    setFotoName(file.name)
    setFotoPreview(URL.createObjectURL(file))
    setErrorMsg(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFotoSelect(e.dataTransfer.files?.[0])
  }

  const handleRemoveFoto = () => {
    setFotoFile(null)
    setFotoPreview(null)
    setFotoName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCancel = () => {
    setFormState(initialFormState)
    handleRemoveFoto()
    setErrorMsg(null)
    onNav('stok')
  }

  const handleSimpan = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!formState.nama_barang.trim()) { setErrorMsg('Nama barang wajib diisi.'); return }
    if (!formState.kategori_id) { setErrorMsg('Kategori wajib dipilih.'); return }
    if (!formState.harga_beli || parseFloat(formState.harga_beli) <= 0) { setErrorMsg('Harga beli wajib diisi.'); return }
    if (!formState.harga_eceran || parseFloat(formState.harga_eceran) <= 0) { setErrorMsg('Harga jual wajib diisi.'); return }

    try {
      const hargaEceran = parseFloat(formState.harga_eceran)
      const payload = {
        nama_barang:  formState.nama_barang.trim(),
        kategori_id:  parseInt(formState.kategori_id),
        merek:        formState.merek.trim() || null,
        satuan:       formState.satuan.trim() || 'Pcs',
        harga_beli:   parseFloat(formState.harga_beli),
        harga_eceran: hargaEceran,
        harga_grosir: Math.round(hargaEceran * 0.9),   // default 90% dari eceran
        stok_awal:    formState.stok_awal    ? parseInt(formState.stok_awal)       : 0,
        minimum_stok: formState.minimum_stok ? parseInt(formState.minimum_stok)    : 0,
      }
      if (formState.sku.trim()) payload.sku = formState.sku.trim()

      const result = await simpanProduk(payload)

      setSuccessMsg(`Produk "${result.nama_barang}" berhasil ditambahkan dengan SKU ${result.sku}!`)
      setFormState(initialFormState)
      handleRemoveFoto()
      setTimeout(() => onNav('stok'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.errors ?? 'Gagal menyimpan produk.'
      setErrorMsg(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg)
    }
  }

  const uploadBoxJsx = (
    <label
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: isStacked ? 160 : '100%',
        minHeight: isStacked ? 140 : 160,
        background: '#FBFBFB', borderRadius: 10, cursor: 'pointer',
        border: isDragging ? '2px dashed #FFCD71' : '2px dashed transparent',
        transition: 'border 0.2s', gap: 6, position: 'relative',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={e => handleFotoSelect(e.target.files?.[0])}
        style={{ display: 'none' }}
      />

      {fotoPreview ? (
        <>
          <img
            src={fotoPreview}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }}
          />
          <button
            onClick={(e) => { e.preventDefault(); handleRemoveFoto() }}
            style={{
              position: 'absolute', top: 6, right: 6,
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: 'none',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={12} color="#fff" />
          </button>
        </>
      ) : (
        <>
          <Camera size={36} color={COLOR.textMuted} strokeWidth={1.3} />
          <div style={{ textAlign: 'center', lineHeight: 1.6 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#000', fontFamily: font }}>
              Tarik gambar ke sini{' '}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FFCD71', fontFamily: font }}>
              atau klik untuk pilih
            </span>
          </div>
          <div style={{ fontSize: 11, color: COLOR.textMuted, fontFamily: font }}>
            Format: JPG, PNG (Maks. 2MB)
          </div>
          {fotoName && (
            <div style={{ fontSize: 11, color: COLOR.amber, fontFamily: font }}>{fotoName}</div>
          )}
        </>
      )}
    </label>
  )

  return (
    <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: `1px solid ${COLOR.border}`, fontFamily: font, maxWidth: 1100, margin: '20px auto 0' }}>
      <div style={{ background: '#FFCD71', padding: '12px 18px', fontSize: 15, fontWeight: 500, color: '#000', fontFamily: font }}>
        Tambah Barang Baru
      </div>

      <div style={{ padding: isMobile ? '14px 16px 20px' : '16px 20px 24px' }}>

        {successMsg && (
          <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#16A34A', fontFamily: font, marginBottom: 16 }}>
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontFamily: font, marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        {/* Informasi Dasar */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={sectionTitleStyle}>Informasi Dasar</div>
            <div style={{ height: 2, background: COLOR.amber, width: 136, borderRadius: 2 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isStacked ? '1fr' : '3fr 2fr', gap: 20 }}>
            {/* Kolom kiri: field-field teks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: isStacked ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Nama Barang <span style={{ color: '#DC2626' }}>*</span></label>
                  <input type="text" value={formState.nama_barang} onChange={handleChange('nama_barang')} placeholder="Contoh: AKI GS Astra" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Kode SKU</label>
                  <input type="text" value={formState.sku} onChange={handleChange('sku')} placeholder="GS-NSXXX" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isStacked ? '1fr' : '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Kategori <span style={{ color: '#DC2626' }}>*</span></label>
                  {loadingKategori ? (
                    <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 8, color: COLOR.textMuted }}>
                      <Loader size={13} color={COLOR.amber} /> Memuat...
                    </div>
                  ) : (
                    <select value={formState.kategori_id} onChange={handleChange('kategori_id')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option value="">-- Pilih Kategori --</option>
                      {(kategoriList ?? []).map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Merek</label>
                  <input type="text" value={formState.merek} onChange={handleChange('merek')} placeholder="Contoh: GS Astra" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Satuan</label>
                  <input type="text" value={formState.satuan} onChange={handleChange('satuan')} placeholder="Pcs" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Kolom kanan: upload gambar, tinggi menyesuaikan kedua baris */}
            <div style={{ maxWidth: 360 }}>
              <label style={labelStyle}>Upload Gambar</label>
              {uploadBoxJsx}
            </div>
          </div>
        </div>

        {/* Harga & Stok */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={sectionTitleStyle}>Harga &amp; Stok</div>
            <div style={{ height: 2, background: COLOR.amber, width: 110, borderRadius: 2 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isStacked ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Harga Beli (Modal) <span style={{ color: '#DC2626' }}>*</span></label>
              <input type="number" min={0} value={formState.harga_beli} onChange={handleChange('harga_beli')} placeholder="Contoh: Rp. 740.000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Harga Jual (Eceran) <span style={{ color: '#DC2626' }}>*</span></label>
              <input type="number" min={0} value={formState.harga_eceran} onChange={handleChange('harga_eceran')} placeholder="Contoh: Rp. 900.000" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isStacked ? '1fr' : '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Stok Awal</label>
              <input type="number" min={0} value={formState.stok_awal} onChange={handleChange('stok_awal')} placeholder="Contoh: 42" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Minimum Stok (Peringatan)</label>
              <input type="number" min={0} value={formState.minimum_stok} onChange={handleChange('minimum_stok')} placeholder="Contoh: 5" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Tombol */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={handleCancel} disabled={loadingSimpan} style={{ width: isStacked ? undefined : 110, flex: isStacked ? 1 : undefined, height: 40, background: '#F4F5F7', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: COLOR.textMuted, cursor: 'pointer', fontFamily: font }}>
            Batalkan
          </button>
          <button onClick={handleSimpan} disabled={loadingSimpan} style={{ width: isStacked ? undefined : 160, flex: isStacked ? 1 : undefined, height: 40, background: loadingSimpan ? COLOR.border : '#FFA500', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: loadingSimpan ? COLOR.textMuted : '#fff', cursor: loadingSimpan ? 'not-allowed' : 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loadingSimpan ? <Loader size={16} color="#fff" /> : <Save size={16} />}
            {loadingSimpan ? 'Menyimpan...' : 'Simpan Barang'}
          </button>
        </div>
      </div>
    </div>
  )
}