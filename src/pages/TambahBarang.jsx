import { useState, useRef } from 'react'
import { Save, Upload } from 'lucide-react'
import { COLOR } from '../constants/colors'

const font = "'Geist', sans-serif"

const initialFormState = {
  namaBarang:  '',
  kodeSku:     '',
  kategori:    'AKI Mobil',
  merek:       '',
  satuan:      '',
  hargaBeli:   '',
  hargaJual:   '',
  stokAwal:    '',
  minimumStok: '',
}

const inputStyle = {
  width:        '100%',
  height:       40,
  background:   '#FBFBFB',
  border:       'none',
  outline:      'none',
  borderRadius: 8,
  padding:      '0 10px',
  fontSize:     13,
  color:        '#000',
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

const sectionTitleStyle = {
  fontSize:     15,
  fontWeight:   500,
  color:        '#000',
  fontFamily:   font,
  marginBottom: 6,
}

export default function TambahBarang({ onNav }) {
  const [formState, setFormState]         = useState(initialFormState)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedName, setUploadedName]   = useState('')
  const [isDragging, setIsDragging]       = useState(false)
  const fileInputRef                      = useRef(null)

  const handleChange = (field) => (e) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleImageSelect = (file) => {
    if (!file) return
    setUploadedName(file.name)
    setUploadedImage(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageSelect(e.dataTransfer.files?.[0])
  }

  const handleCancel = () => {
    setFormState(initialFormState)
    setUploadedImage(null)
    setUploadedName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    onNav('stok')
  }

  return (
    <div style={{
      background:   '#fff',
      borderRadius: 8,
      overflow:     'hidden',
      border:       `1px solid ${COLOR.border}`,
      fontFamily:   font,
    }}>

      {/* ── Banner ───────────────────────────── */}
      <div style={{
        background: '#FFCD71',
        padding:    '12px 18px',
        fontSize:   15,
        fontWeight: 500,
        color:      '#000',
        fontFamily: font,
      }}>
        Tambah Barang Baru
      </div>

      {/* ── Form Body ────────────────────────── */}
      <div style={{ padding: '16px 20px 24px' }}>

        {/* ── Informasi Dasar ──────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={sectionTitleStyle}>Informasi Dasar</div>
            <div style={{ height: 2, background: COLOR.amber, width: 136, borderRadius: 2 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>

            {/* Kolom kiri + tengah */}
            <div style={{ gridColumn: '1 / 3', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Nama Barang + Kode SKU */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Nama Barang</label>
                  <input
                    type="text"
                    value={formState.namaBarang}
                    onChange={handleChange('namaBarang')}
                    placeholder="Contoh: AKI GS Astra"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Kode SKU</label>
                  <input
                    type="text"
                    value={formState.kodeSku}
                    onChange={handleChange('kodeSku')}
                    placeholder="GS-NSXXX"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Kategori + Merek + Satuan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Kategori</label>
                  <select
                    value={formState.kategori}
                    onChange={handleChange('kategori')}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="AKI Mobil">AKI Mobil</option>
                    <option value="AKI Motor">AKI Motor</option>
                    <option value="Oli">Oli</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Merek</label>
                  <input
                    type="text"
                    value={formState.merek}
                    onChange={handleChange('merek')}
                    placeholder="Contoh: GS Astra"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Satuan</label>
                  <input
                    type="text"
                    value={formState.satuan}
                    onChange={handleChange('satuan')}
                    placeholder="Contoh: Pcs"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Upload Gambar */}
            <div>
              <label style={labelStyle}>Upload Gambar</label>
              <label
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  height:         160,
                  background:     '#FBFBFB',
                  borderRadius:   10,
                  cursor:         'pointer',
                  border:         isDragging ? '2px dashed #FFCD71' : '2px dashed transparent',
                  transition:     'border 0.2s',
                  gap:            6,
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={e => handleImageSelect(e.target.files?.[0])}
                  style={{ display: 'none' }}
                />
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }}
                  />
                ) : (
                  <>
                    <Upload size={36} color={COLOR.textMuted} strokeWidth={1} />
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
                    {uploadedName && (
                      <div style={{ fontSize: 11, color: COLOR.textMuted, fontFamily: font }}>
                        {uploadedName}
                      </div>
                    )}
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* ── Harga & Stok ─────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={sectionTitleStyle}>Harga &amp; Stok</div>
            <div style={{ height: 2, background: COLOR.amber, width: 110, borderRadius: 2 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Harga Beli (Modal)</label>
              <input
                type="text"
                inputMode="numeric"
                value={formState.hargaBeli}
                onChange={handleChange('hargaBeli')}
                placeholder="Contoh: Rp. 740.000"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Harga Jual (Eceran)</label>
              <input
                type="text"
                inputMode="numeric"
                value={formState.hargaJual}
                onChange={handleChange('hargaJual')}
                placeholder="Contoh: Rp. 900.000"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Stok Awal</label>
              <input
                type="text"
                inputMode="numeric"
                value={formState.stokAwal}
                onChange={handleChange('stokAwal')}
                placeholder="Contoh: 42"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Minimum Stok (Peringatan)</label>
              <input
                type="text"
                inputMode="numeric"
                value={formState.minimumStok}
                onChange={handleChange('minimumStok')}
                placeholder="Contoh: 5"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* ── Action Buttons ───────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={handleCancel}
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
              background:     '#FFA500',
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
            Simpan Barang
          </button>
        </div>

      </div>
    </div>
  )
}