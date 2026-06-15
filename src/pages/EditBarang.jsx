import { useState } from 'react'
import { Save } from 'lucide-react'
import { COLOR } from '../constants/colors'

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

export default function EditBarang({ onNav }) {
  const [formData, setFormData] = useState({
    namaBarang:  'GS Astra MF NS40Z',
    kodeSku:     'GS-NS40Z',
    kategori:    'Aki Mobil',
    merek:       'GS Astra',
    satuan:      'Pcs',
    hargaBeli:   'Rp. 740.000',
    hargaJual:   'Rp. 900.000',
    stokSaatIni: '30',
    minimumStok: '5',
  })

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: font }}>

      {/* ── Baris atas: Foto + Info Dasar ────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '386px 1fr', gap: 20 }}>

        {/* Foto Produk */}
        <div style={cardStyle}>
          <div style={{ padding: '28px 24px' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#000', fontFamily: font, marginBottom: 20 }}>
              Foto Produk
            </div>
            {/* Gambar placeholder */}
            <div style={{
              width:          203,
              height:         203,
              background:     '#1A3A0A',
              borderRadius:   8,
              margin:         '0 auto 16px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, fontFamily: font }}>GS</span>
            </div>
            <div style={{
              textAlign:  'center',
              fontSize:   13,
              color:      COLOR.textMuted,
              fontFamily: font,
            }}>
              Format: JPG, PNG (Maks. 2MB)
            </div>
          </div>
        </div>

        {/* Informasi Dasar */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Informasi Dasar</div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Nama Barang */}
            <div>
              <label style={labelStyle}>Nama Barang</label>
              <input
                type="text"
                value={formData.namaBarang}
                onChange={handleChange('namaBarang')}
                style={inputStyle}
              />
            </div>

            {/* Kode SKU + Kategori */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Kode SKU</label>
                <input
                  type="text"
                  value={formData.kodeSku}
                  onChange={handleChange('kodeSku')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={handleChange('kategori')}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="Aki Mobil">Aki Mobil</option>
                  <option value="Aki Motor">Aki Motor</option>
                  <option value="Oli">Oli</option>
                </select>
              </div>
            </div>

            {/* Merek + Satuan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

      {/* ── Baris bawah: Status Inventaris + Harga & Stok ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '386px 1fr', gap: 20 }}>

        {/* Status Inventaris */}
        <div style={cardStyle}>
          <div style={{ padding: '18px 24px' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#000', fontFamily: font, marginBottom: 20 }}>
              Status Inventaris
            </div>

            {/* Tersedia */}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '12px 0',
              borderBottom:   `1px solid ${COLOR.border}`,
            }}>
              <span style={{ fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>Tersedia</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#000', fontFamily: font }}>42 Unit</span>
            </div>

            {/* Terjual */}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '12px 0',
              borderBottom:   `1px solid ${COLOR.border}`,
            }}>
              <span style={{ fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>Terjual (bulan ini)</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#000', fontFamily: font }}>15 Unit</span>
            </div>

            {/* Status Stok */}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '12px 0',
            }}>
              <span style={{ fontSize: 13, color: COLOR.textMuted, fontFamily: font }}>Status Stok</span>
              <div style={{
                background:   '#FFF7E8',
                borderRadius: 5,
                padding:      '3px 10px',
                fontSize:     11,
                fontWeight:   500,
                color:        '#734A00',
                fontFamily:   font,
              }}>
                Stok Aman
              </div>
            </div>
          </div>
        </div>

        {/* Harga & Stok */}
        <div style={cardStyle}>
          <div style={bannerStyle}>Harga &amp; Stok</div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Harga Beli + Harga Jual */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Harga Beli (Modal)</label>
                <input
                  type="text"
                  value={formData.hargaBeli}
                  onChange={handleChange('hargaBeli')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Harga Jual (Eceran)</label>
                <input
                  type="text"
                  value={formData.hargaJual}
                  onChange={handleChange('hargaJual')}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Stok Saat Ini + Minimum Stok */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Stok Saat Ini</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.stokSaatIni}
                  onChange={handleChange('stokSaatIni')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Minimum Stok (Peringatan)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.minimumStok}
                  onChange={handleChange('minimumStok')}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ───────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        <button
          onClick={() => onNav('stok')}
          style={{
            width:        152,
            height:       56,
            background:   '#F4F5F7',
            border:       'none',
            borderRadius: 8,
            fontSize:     17,
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
            width:          253,
            height:         56,
            background:     '#FFA500',
            border:         'none',
            borderRadius:   8,
            fontSize:       17,
            fontWeight:     600,
            color:          '#fff',
            cursor:         'pointer',
            fontFamily:     font,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            10,
          }}
        >
          <Save size={18} />
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}