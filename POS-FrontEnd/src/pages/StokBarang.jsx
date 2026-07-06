import { useState, useEffect, useMemo } from 'react'
import { Filter, Plus, Pencil, Trash2, Loader } from 'lucide-react'
import { COLOR }       from '../constants/colors'
import { produkService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'
import { fmt }         from '../utils/format'
import StatCard        from '../components/ui/StatCard'
import Badge           from '../components/ui/Badge'
import TableHeader     from '../components/ui/TableHeader'
import SearchBar       from '../components/ui/SearchBar'
import PrimaryBtn      from '../components/ui/PrimaryBtn'
import ActionBtn       from '../components/ui/ActionBtn'
import ProductImage    from '../components/shared/ProductImage'
import { useIsMobile } from '../hooks/useIsMobile'

// Helper format rupiah ringkas untuk StatCard
function formatRupiah(value) {
  if (!value && value !== 0) return '-'
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`
  if (value >= 1_000_000)     return `Rp ${(value / 1_000_000).toFixed(1)} JT`
  return `Rp ${value.toLocaleString('id-ID')}`
}

export default function StokBarang({ onNav }) {
  const [search,     setSearch]     = useState('')
  const [filterKat,  setFilterKat]  = useState('semua')
  const [showFilter, setShowFilter] = useState(false)
  const [konfirmHapus, setKonfirmHapus] = useState(null) // sku produk yang mau dihapus

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  // ── Fetch produk dari API ────────────────────────────────
  const { data: produkList, loading, error, execute: fetchProduk } = useApi(produkService.getAll)
  const { loading: loadingHapus, execute: hapusProduk } = useMutation(produkService.delete)

  useEffect(() => {
    fetchProduk()
  }, [])

  // ── Derived data (dihitung dari produkList) ──────────────
  const semuaProduk = produkList ?? []

  const filtered = useMemo(() => {
    return semuaProduk.filter(p => {
      const matchSearch = search.trim() === '' ||
        p.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.merek ?? '').toLowerCase().includes(search.toLowerCase())

      const matchKat = filterKat === 'semua' || p.kategori === filterKat

      return matchSearch && matchKat
    })
  }, [semuaProduk, search, filterKat])

  // StatCard values dihitung langsung dari data yang sudah ada
  const totalProduk = semuaProduk.length
  const stokTipis   = semuaProduk.filter(p =>
    p.stok_per_cabang?.some(s => s.perlu_restock)
  ).length
  const totalAset   = semuaProduk.reduce((sum, p) => {
    const totalStok = p.stok_per_cabang?.reduce((s, c) => s + (c.stok_saat_ini ?? 0), 0) ?? 0
    return sum + totalStok * parseFloat(p.harga_beli ?? 0)
  }, 0)

  // "Barang Baru" = 4 produk terakhir di list (backend sort by created_at default)
  const barangBaru = semuaProduk.slice(0, 4)

  // Kategori unik untuk filter dropdown
  const kategoriList = ['semua', ...new Set(semuaProduk.map(p => p.kategori).filter(Boolean))]

  // ── Handler hapus produk ─────────────────────────────────
  const handleHapus = async (sku) => {
    try {
      await hapusProduk(sku)
      setKonfirmHapus(null)
      fetchProduk() // refresh list
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Gagal menghapus produk.'
      alert(msg)
      setKonfirmHapus(null)
    }
  }

  // ── Blocks ───────────────────────────────────────────────

  const statCardsBlock = (
    <div style={{ marginBottom: isMobile ? 16 : 24 }}>
      {isStacked ? (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <StatCard
              label="Total Produk"
              value={loading ? '...' : String(totalProduk)}
              compact
            />
            <StatCard
              label="Stok Tipis"
              value={loading ? '...' : `${stokTipis} Items`}
              compact
            />
          </div>
          <StatCard
            label="Total Aset"
            value={loading ? '...' : formatRupiah(totalAset)}
            compact
          />
        </>
      ) : (
        <div style={{ display: 'flex', gap: 16 }}>
          <StatCard label="Total Produk" value={loading ? '...' : String(totalProduk)} />
          <StatCard label="Stok Tipis"   value={loading ? '...' : `${stokTipis} Items`} />
          <StatCard label="Total Aset"   value={loading ? '...' : formatRupiah(totalAset)} />
        </div>
      )}
    </div>
  )

  const searchFilterAddBlock = (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display:       'flex',
        flexDirection: 'row',
        gap:           12,
        marginBottom:  isStacked ? 12 : 0,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SearchBar
            placeholder="Cari nama produk, merek, atau SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter dropdown */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setShowFilter(f => !f)}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            6,
              padding:        '10px 14px',
              border:         `1px solid ${filterKat !== 'semua' ? COLOR.amber : COLOR.border}`,
              borderRadius:   8,
              background:     filterKat !== 'semua' ? COLOR.amberLight : '#fff',
              fontSize:       13,
              color:          filterKat !== 'semua' ? COLOR.amber : COLOR.textSub,
              cursor:         'pointer',
              fontFamily:     'inherit',
              whiteSpace:     'nowrap',
            }}
          >
            <Filter size={14} />
            {filterKat === 'semua' ? 'Filter' : filterKat}
          </button>

          {showFilter && (
            <div style={{
              position:     'absolute',
              top:          '110%',
              right:        0,
              background:   '#fff',
              border:       `1px solid ${COLOR.border}`,
              borderRadius: 8,
              boxShadow:    '0 4px 16px rgba(0,0,0,0.1)',
              zIndex:       20,
              minWidth:     140,
              overflow:     'hidden',
            }}>
              {kategoriList.map(k => (
                <div
                  key={k}
                  onClick={() => { setFilterKat(k); setShowFilter(false) }}
                  style={{
                    padding:    '10px 14px',
                    fontSize:   13,
                    cursor:     'pointer',
                    fontWeight: filterKat === k ? 700 : 400,
                    color:      filterKat === k ? COLOR.amber : COLOR.text,
                    background: filterKat === k ? COLOR.amberLight : '#fff',
                    textTransform: 'capitalize',
                  }}
                >
                  {k === 'semua' ? 'Semua Kategori' : k}
                </div>
              ))}
            </div>
          )}
        </div>

        {!isStacked && (
          <div style={{ marginLeft: 'auto' }}>
            <PrimaryBtn icon={Plus} onClick={() => onNav('tambahBarang')}>
              Tambah Barang
            </PrimaryBtn>
          </div>
        )}
      </div>

      {isStacked && (
        <div style={{ width: '100%' }}>
          <PrimaryBtn
            icon={Plus}
            onClick={() => onNav('tambahBarang')}
            style={{ width: '100%' }}
          >
            Tambah Barang
          </PrimaryBtn>
        </div>
      )}
    </div>
  )

  const auditStokBlock = (
    <div style={{
      background:   '#4A3500',
      borderRadius: 12,
      padding:      isMobile ? 16 : 20,
      color:        '#fff',
      width:        '100%',
      boxSizing:    'border-box',
      marginBottom: isStacked ? 16 : 0,
    }}>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Audit Stok</div>
      <div style={{
        fontSize:     12,
        color:        '#D4B483',
        marginBottom: 16,
        lineHeight:   1.6,
      }}>
        Lakukan pengecekan fisik barang untuk memastikan kesesuaian data sistem.
      </div>
      <button
        onClick={() => onNav('audit')}
        style={{
          background:   '#fff',
          color:        '#4A3500',
          border:       'none',
          borderRadius: 8,
          padding:      '8px 16px',
          fontWeight:   700,
          fontSize:     13,
          cursor:       'pointer',
          fontFamily:   'inherit',
          width:        isMobile ? '100%' : 'auto',
        }}
      >
        Mulai Opname
      </button>
    </div>
  )

  const tabelBlock = (
    <div style={{
      background:   COLOR.card,
      border:       `1px solid ${COLOR.border}`,
      borderRadius: 12,
      overflow:     'hidden',
      marginBottom: isStacked ? 16 : 0,
    }}>
      {/* Loading state */}
      {loading && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
          <Loader size={20} color={COLOR.amber} />
          <div style={{ marginTop: 8 }}>Memuat data produk...</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ padding: '24px 20px', color: '#DC2626', fontSize: 13 }}>
          Gagal memuat produk: {error}
          <button
            onClick={() => fetchProduk()}
            style={{ marginLeft: 12, color: COLOR.amber, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Tabel */}
      {!loading && !error && (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 640 : 720 }}>
            <TableHeader cols={['No', 'Nama Produk', 'Kategori', 'Harga Beli', 'Harga Jual', 'Satuan', 'Aksi']} />
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
                    {search ? `Produk "${search}" tidak ditemukan.` : 'Belum ada produk.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.sku} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{i + 1}.</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ProductImage width={28} height={22} />
                        <div>
                          <div>{p.nama_barang}</div>
                          <div style={{ fontSize: 11, color: COLOR.textMuted }}>{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge color={p.kategori === 'Basah' ? 'amber' : 'gray'}>
                        {p.kategori}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {fmt(p.harga_beli)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {fmt(p.harga_eceran)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.satuan}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <ActionBtn
                          icon={Pencil}
                          onClick={() => onNav('editBarang', { sku: p.sku })}
                        />
                        <ActionBtn
                          icon={Trash2}
                          color={COLOR.red}
                          onClick={() => setKonfirmHapus(p)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const barangBaruBlock = (
    <div style={{
      background:   COLOR.card,
      border:       `1px solid ${COLOR.border}`,
      borderRadius: 12,
      padding:      isMobile ? 16 : 20,
      width:        isStacked ? '100%' : undefined,
      boxSizing:    'border-box',
      flex:         isStacked ? undefined : 1,
      minWidth:     0,
    }}>
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   14,
      }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Barang Baru</div>
        <span
          onClick={() => onNav('tambahBarang')}
          style={{ color: COLOR.amber, fontSize: 12, cursor: 'pointer' }}
        >
          Tambah Baru
        </span>
      </div>

      {loading ? (
        <div style={{ color: COLOR.textMuted, fontSize: 13 }}>Memuat...</div>
      ) : barangBaru.length === 0 ? (
        <div style={{ color: COLOR.textMuted, fontSize: 13 }}>Belum ada produk.</div>
      ) : (
        <div style={{
          display:             isStacked ? 'grid' : 'block',
          gridTemplateColumns: isStacked ? '1fr 1fr' : undefined,
          gap:                 isStacked ? 12 : 0,
        }}>
          {barangBaru.map((b, i) => {
            const totalStok = b.stok_per_cabang?.reduce((s, c) => s + (c.stok_saat_ini ?? 0), 0) ?? 0
            return (
              <div key={b.sku} style={{
                display:       'flex',
                alignItems:    isStacked ? 'flex-start' : 'center',
                flexDirection: isStacked ? 'column' : 'row',
                gap:           isStacked ? 6 : 10,
                padding:       isStacked ? 0 : '8px 0',
                borderBottom:  (!isStacked && i < barangBaru.length - 1) ? `1px solid ${COLOR.border}` : 'none',
              }}>
                <ProductImage width={isStacked ? 48 : 36} height={isStacked ? 36 : 28} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{b.nama_barang}</div>
                  <div style={{ fontSize: 11, color: COLOR.textMuted }}>
                    Stok: {totalStok} {b.satuan}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── Modal konfirmasi hapus ───────────────────────────────
  const modalHapus = konfirmHapus && (
    <div style={{
      position:       'fixed',
      inset:          0,
      background:     'rgba(0,0,0,0.4)',
      zIndex:         50,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        16,
    }}>
      <div style={{
        background:   '#fff',
        borderRadius: 12,
        padding:      24,
        maxWidth:     360,
        width:        '100%',
        boxShadow:    '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Hapus Produk?</div>
        <div style={{ fontSize: 13, color: COLOR.textSub, marginBottom: 20, lineHeight: 1.6 }}>
          Produk <strong>{konfirmHapus.nama_barang}</strong> akan dihapus permanen.
          Produk yang sudah pernah ada di transaksi tidak bisa dihapus.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setKonfirmHapus(null)}
            disabled={loadingHapus}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: `1px solid ${COLOR.border}`, background: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Batal
          </button>
          <button
            onClick={() => handleHapus(konfirmHapus.sku)}
            disabled={loadingHapus}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: 'none', background: COLOR.red, color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: loadingHapus ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}
          >
            {loadingHapus && <Loader size={14} color="#fff" />}
            {loadingHapus ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )

  // ── Render ───────────────────────────────────────────────
  if (isStacked) {
    return (
      <div style={{ paddingTop: isMobile ? 16 : 24 }}>
        {modalHapus}
        {statCardsBlock}
        {searchFilterAddBlock}
        {auditStokBlock}
        {tabelBlock}
        {barangBaruBlock}
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 24 }}>
      {modalHapus}
      {statCardsBlock}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 280px',
        gap:                 20,
      }}>
        <div style={{ minWidth: 0 }}>
          {searchFilterAddBlock}
          {tabelBlock}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {auditStokBlock}
          {barangBaruBlock}
        </div>
      </div>
    </div>
  )
}