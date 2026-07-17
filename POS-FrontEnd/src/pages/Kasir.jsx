import { useState, useEffect, useCallback } from 'react'
import {
  Package, ClipboardList, Users, Minus, Plus,
  ShoppingCart, X, Search, Loader,
} from 'lucide-react'
import { COLOR } from '../constants/colors'
import { produkService, memberService, transaksiService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { fmt } from '../utils/format'
import Badge        from '../components/ui/Badge'
import ProductImage from '../components/shared/ProductImage'
import { useIsMobile } from '../hooks/useIsMobile'

// ─────────────────────────────────────────────────────────────
// Helper: baca PPN dari pengaturan (disimpan Settings.jsx)
// ─────────────────────────────────────────────────────────────
function getTaxPercent() {
  try {
    const raw = localStorage.getItem('pos_settings')
    const parsed = raw ? JSON.parse(raw) : null
    const val = parsed?.transaction?.taxPercent
    return typeof val === 'number' && !isNaN(val) ? val : 3
  } catch {
    return 3
  }
}

// ─────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────
function ProductCard({ produk, onAdd, isActive, isMobile }) {
  const stok = produk.stok_saat_ini ?? 0

  return (
    <div
      onClick={() => stok > 0 && onAdd(produk)}
      style={{
        background:   isActive ? COLOR.amberLight : COLOR.card,
        border:       `2px solid ${isActive ? COLOR.amber : COLOR.border}`,
        borderRadius: 12,
        padding:      isMobile ? 12 : 16,
        cursor:       stok > 0 ? 'pointer' : 'not-allowed',
        position:     'relative',
        transition:   'all 0.15s',
        opacity:      stok === 0 ? 0.5 : 1,
      }}
    >
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Badge color={stok <= 3 ? 'red' : 'amber'}>{stok} Tersedia</Badge>
      </div>
      <div style={{
        height:         isMobile ? 80 : 100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   12,
      }}>
        <ProductImage
          src={produk.foto_url}
          alt={produk.nama_barang}
          width={isMobile ? 60 : 80}
          height={isMobile ? 60 : 80}
        />
      </div>
      <div style={{
        fontSize:        13,
        fontWeight:      700,
        marginBottom:    2,
        overflow:        'hidden',
        textOverflow:    'ellipsis',
        display:         '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {produk.nama_barang}
      </div>
      <div style={{ fontSize: 12, color: COLOR.textMuted, marginBottom: 8 }}>
        {produk.kategori}
      </div>
      <div style={{
        display:        'flex',
        flexDirection:  isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems:     isMobile ? 'flex-start' : 'flex-end',
        gap:            isMobile ? 6 : 0,
      }}>
        <div>
          <Badge color="gray">Eceran</Badge>
          <div style={{ fontSize: 13, marginTop: 4 }}>{fmt(produk.harga_eceran)}</div>
        </div>
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <span style={{ color: COLOR.amber, fontWeight: 600, fontSize: 12 }}>Grosir</span>
          <div style={{ color: COLOR.amber, fontWeight: 700, fontSize: 13 }}>
            {fmt(produk.harga_grosir)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KeranjangItem
// ─────────────────────────────────────────────────────────────
function KeranjangItem({ item, onUpdateQty }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          10,
      padding:      '10px 0',
      borderBottom: `1px solid ${COLOR.border}`,
    }}>
      <ProductImage src={item.foto_url} alt={item.nama_barang} width={36} height={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize:     12,
          fontWeight:   600,
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.nama_barang}
        </div>
        <div style={{ fontSize: 11, color: COLOR.textMuted }}>{item.kategori}</div>
        <div style={{ fontSize: 11, color: COLOR.textSub }}>
          {item.qty} x {fmt(item.harga_satuan)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => onUpdateQty(item.sku, -1)}
          style={{
            width: 24, height: 24,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 4, background: '#fff',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Minus size={10} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, width: 20, textAlign: 'center' }}>
          {item.qty}
        </span>
        <button
          onClick={() => onUpdateQty(item.sku, 1)}
          style={{
            width: 24, height: 24,
            border: 'none', borderRadius: 4,
            background: COLOR.amber, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={10} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MemberSearch — popup cari & pilih member
// ─────────────────────────────────────────────────────────────
function MemberSearch({ selectedMember, onSelect, onClear }) {
  const [query,  setQuery]  = useState('')
  const [open,   setOpen]   = useState(false)
  const { data: results, loading, execute: cariMember } = useApi(memberService.getAll)

  const handleSearch = useCallback((q) => {
    setQuery(q)
    if (q.length >= 2) {
      cariMember({ search: q, status: 'aktif' })
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [cariMember])

  if (selectedMember) {
    return (
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        background:   COLOR.amberLight,
        borderRadius: 8,
        padding:      '8px 12px',
      }}>
        <div style={{
          width: 30, height: 30, background: COLOR.amber,
          borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Users size={14} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedMember.nama_member}</div>
          <div style={{ fontSize: 11, color: COLOR.textMuted }}>
            {selectedMember.id_member} · {selectedMember.poin} poin · {selectedMember.tier_loyalty}
          </div>
        </div>
        <button
          onClick={onClear}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <X size={14} color={COLOR.textMuted} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          8,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 8,
        padding:      '8px 12px',
        background:   '#fff',
      }}>
        {loading ? <Loader size={14} color={COLOR.textMuted} /> : <Search size={14} color={COLOR.textMuted} />}
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari member (nama / no. HP)..."
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 12, background: 'transparent', fontFamily: 'inherit',
          }}
        />
      </div>

      {open && results && results.length > 0 && (
        <div style={{
          position:  'absolute',
          top:       '110%',
          left:      0,
          right:     0,
          background: '#fff',
          border:    `1px solid ${COLOR.border}`,
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          zIndex:    50,
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          {results.map((m) => (
            <div
              key={m.id_member}
              onClick={() => { onSelect(m); setOpen(false); setQuery('') }}
              style={{
                padding:  '10px 14px',
                cursor:   'pointer',
                fontSize: 13,
                borderBottom: `1px solid ${COLOR.border}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = COLOR.amberLight}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontWeight: 600 }}>{m.nama_member}</div>
              <div style={{ fontSize: 11, color: COLOR.textMuted }}>
                {m.id_member} · {m.no_telepon} · {m.poin} poin
              </div>
            </div>
          ))}
        </div>
      )}

      {open && results && results.length === 0 && !loading && (
        <div style={{
          position:   'absolute',
          top:        '110%',
          left:       0,
          right:      0,
          background: '#fff',
          border:     `1px solid ${COLOR.border}`,
          borderRadius: 8,
          padding:    '12px 14px',
          fontSize:   13,
          color:      COLOR.textMuted,
          zIndex:     50,
        }}>
          Member tidak ditemukan.
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TransaksiPanel
// ─────────────────────────────────────────────────────────────
function TransaksiPanel({
  keranjang, setKeranjang,
  handleUpdateQty,
  selectedMember, setSelectedMember,
  isMobile, onClose,
  onProses, prosesLoading, prosesError,
}) {
  const subtotal   = keranjang.reduce((s, i) => s + i.harga_satuan * i.qty, 0)
  const taxPercent = getTaxPercent()
  const tax        = Math.round(subtotal * (taxPercent / 100))
  const total      = subtotal + tax

  return (
    <>
      {/* Header */}
      <div style={{ padding: isMobile ? '16px 16px 14px' : '20px 24px 14px', borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Transaksi Detail</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: COLOR.textMuted }}>Baru</span>
            {isMobile && (
              <button
                onClick={onClose}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: 'none', background: '#F4F5F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} color={COLOR.textMuted} />
              </button>
            )}
          </div>
        </div>

        {/* Member search */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub, marginBottom: 8 }}>
            Member (opsional)
          </div>
          <MemberSearch
            selectedMember={selectedMember}
            onSelect={setSelectedMember}
            onClear={() => setSelectedMember(null)}
          />
        </div>
      </div>

      {/* Keranjang */}
      <div style={{ padding: isMobile ? '14px 16px 10px' : '14px 24px 10px', borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Keranjang</div>
            <div style={{ fontSize: 12, color: COLOR.textMuted }}>{keranjang.length} Items</div>
          </div>
          <button
            onClick={() => setKeranjang([])}
            style={{ background: 'none', border: 'none', color: COLOR.red, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Clear
          </button>
        </div>
        <div
          className="no-scrollbar"
          style={{ maxHeight: isMobile ? 240 : 280, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {keranjang.length === 0 ? (
            <div style={{ textAlign: 'center', color: COLOR.textMuted, fontSize: 13, padding: '20px 0' }}>
              Belum ada produk dipilih.
            </div>
          ) : (
            keranjang.map(item => (
              <KeranjangItem key={item.sku} item={item} onUpdateQty={handleUpdateQty} />
            ))
          )}
        </div>
      </div>

      {/* Total Dibayar (metode pembayaran hanya cash) */}
      <div style={{ padding: isMobile ? '14px 16px' : '14px 24px', borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ fontSize: 12, color: COLOR.textSub, marginBottom: 6 }}>Total Dibayar</div>
        <div style={{ background: '#F7F7F5', borderRadius: 8, padding: '12px 16px', fontSize: 15, fontWeight: 700 }}>
          {fmt(total)}
        </div>
      </div>

      {/* Rincian */}
      <div style={{ padding: isMobile ? '14px 16px' : '14px 24px', flex: 1 }}>
        {[
          ['Amount',   `${keranjang.reduce((s, i) => s + i.qty, 0)} (Items)`],
          ['Subtotal', fmt(subtotal)],
          [`Tax (${taxPercent}%)`, fmt(tax)],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: COLOR.textSub }}>{label}</span>
            <span>{val}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800,
          marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLOR.border}`,
        }}>
          <span>Total</span>
          <span style={{ color: COLOR.amber }}>{fmt(total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
          <span style={{ color: COLOR.textSub }}>Bayar</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
          <span style={{ color: COLOR.textSub }}>Kembali</span>
          <span>{fmt(Math.max(0, subtotal - total))}</span>
        </div>

        {/* Error dari API */}
        {prosesError && (
          <div style={{
            marginTop:    12,
            background:   '#FEF2F2',
            border:       '1px solid #FECACA',
            borderRadius: 8,
            padding:      '8px 12px',
            fontSize:     12,
            color:        '#DC2626',
          }}>
            {prosesError}
          </div>
        )}
      </div>

      {/* Tombol proses */}
      <div style={{ padding: isMobile ? '12px 16px 24px' : '12px 24px 28px' }}>
        <button
          onClick={onProses}
          disabled={prosesLoading || keranjang.length === 0}
          style={{
            width:        '100%',
            background:   keranjang.length === 0 ? COLOR.border : COLOR.amber,
            color:        keranjang.length === 0 ? COLOR.textMuted : '#fff',
            border:       'none',
            borderRadius: 10,
            padding:      16,
            fontWeight:   800,
            fontSize:     14,
            cursor:       keranjang.length === 0 || prosesLoading ? 'not-allowed' : 'pointer',
            fontFamily:   'inherit',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            gap:          8,
          }}
        >
          {prosesLoading && <Loader size={16} color="#fff" />}
          {prosesLoading ? 'Memproses...' : 'Proses Transaksi'}
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Kasir
// ─────────────────────────────────────────────────────────────
export default function Kasir() {
  const { user } = useAuth()

  const [tab,            setTab]            = useState('produk')
  const [keranjang,      setKeranjang]      = useState([])
  const [selectedSku,    setSelectedSku]    = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [showMobileCart, setShowMobileCart] = useState(false)
  const [searchProduk,   setSearchProduk]   = useState('')
  const [successMsg,     setSuccessMsg]     = useState(null)

  const isMobile = useIsMobile()

  // Fetch produk dari API sesuai cabang user yang login
  const cabangId = user?.cabang_id ?? 1
  const { data: produkList, loading: loadingProduk, execute: fetchProduk } = useApi(produkService.getAll)

  useEffect(() => {
    fetchProduk({ cabang_id: cabangId })
  }, [cabangId])

  // Mutation untuk POST transaksi
  const { loading: prosesLoading, error: prosesError, execute: kirimTransaksi } = useMutation(transaksiService.create)

  const produkListArray = Array.isArray(produkList) ? produkList : []

  // Filter produk berdasarkan search dan tab kategori
  const produkTampil = produkListArray.filter((p) => {
    const matchSearch = searchProduk.trim() === '' ||
      p.nama_barang.toLowerCase().includes(searchProduk.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProduk.toLowerCase())

    const matchTab = tab === 'produk'
      ? true  // semua produk masuk tab produk (jasa bisa ditambah nanti)
      : false

    return matchSearch && matchTab
  })

  const subtotal   = keranjang.reduce((s, i) => s + i.harga_satuan * i.qty, 0)
  const totalItems = keranjang.reduce((s, i) => s + i.qty, 0)
  const taxPercent = getTaxPercent()
  const tax        = Math.round(subtotal * (taxPercent / 100))
  const total      = subtotal + tax

  // Tambah produk ke keranjang
  const handleAddToCart = (produk) => {
    setSelectedSku(produk.sku)
    setKeranjang(prev => {
      const exist = prev.find(x => x.sku === produk.sku)
      if (exist) {
        // Cek stok tidak melebihi yang tersedia
        const stokTersedia = produk.stok_saat_ini ?? 0
        if (exist.qty >= stokTersedia) return prev
        return prev.map(x => x.sku === produk.sku ? { ...x, qty: x.qty + 1 } : x)
      }
      return [...prev, {
        sku:          produk.sku,
        nama_barang:  produk.nama_barang,
        kategori:     produk.kategori,
        harga_satuan: produk.harga_eceran,
        foto_url:     produk.foto_url ?? null,
        qty:          1,
      }]
    })
  }

  const handleUpdateQty = (sku, delta) => {
    setKeranjang(prev =>
      prev.map(i => i.sku === sku ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    )
  }

  // Proses transaksi ke API (metode pembayaran selalu cash)
  const handleProses = async () => {
    if (keranjang.length === 0) return

    try {
      const result = await kirimTransaksi({
        metode_pembayaran: 'cash',
        id_member:         selectedMember?.id_member ?? null,
        cabang_id:         cabangId,
        items:             keranjang.map(item => ({
          sku:           item.sku,
          kuantitas:     item.qty,
          harga_satuan:  item.harga_satuan,
        })),
      })

      // Sukses — reset state dan tampilkan pesan
      setKeranjang([])
      setSelectedMember(null)
      setSelectedSku(null)
      setShowMobileCart(false)
      setSuccessMsg(`Transaksi ${result.no_transaksi} berhasil! Total: ${fmt(result.total_bayar)}`)

      const receiptUrl = `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')}/receipt/${result.no_transaksi}`
      window.open(receiptUrl, '_blank', 'noopener,noreferrer')

      // Refresh stok produk setelah transaksi
      fetchProduk({ cabang_id: cabangId })

      // Sembunyikan pesan sukses setelah 4 detik
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (_) {
      // Error sudah ditangani oleh useMutation, tampil di prosesError
    }
  }

  return (
    <div style={{ position: 'relative' }}>

      {/* Success toast */}
      {successMsg && (
        <div style={{
          position:     'fixed',
          top:          20,
          left:         '50%',
          transform:    'translateX(-50%)',
          background:   '#22C55E',
          color:        '#fff',
          borderRadius: 10,
          padding:      '12px 20px',
          fontSize:     13,
          fontWeight:   600,
          zIndex:       100,
          boxShadow:    '0 4px 16px rgba(0,0,0,0.15)',
          whiteSpace:   'nowrap',
        }}>
          ✓ {successMsg}
        </div>
      )}

      <div style={{
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height:        isMobile ? 'auto' : 'calc(100vh - 56px)',
        minHeight:     isMobile ? 'calc(100vh - 56px)' : 'auto',
        overflow:      isMobile ? 'visible' : 'hidden',
      }}>

        {/* ── Panel kiri: daftar produk (tanpa gap ke topbar) ── */}
        <div
          className="no-scrollbar"
          style={{
            flex:            1,
            overflowY:       isMobile ? 'visible' : 'auto',
            paddingTop:      isMobile ? 16 : 24,
            paddingRight:    isMobile ? 16 : 24,
            paddingLeft:     isMobile ? 16 : 24,
            paddingBottom:   isMobile ? 90 : 0,
            height:          isMobile ? 'auto' : '100%',
            scrollbarWidth:  'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Tab kategori */}
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
            Kategori Produk/Jasa
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { key: 'produk', label: 'Produk', icon: Package       },
              { key: 'jasa',   label: 'Jasa',   icon: ClipboardList },
            ].map(({ key, label, icon: Icon }) => {
              const isActive = tab === key
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6,
                    padding:   isMobile ? '10px 16px' : '12px 22px',
                    flex:      isMobile ? 1 : 'none',
                    borderRadius: 10,
                    border:    `2px solid ${isActive ? COLOR.amber : COLOR.border}`,
                    background: '#fff',
                    color:     isActive ? COLOR.amber : COLOR.textSub,
                    cursor:    'pointer', fontWeight: 600, fontSize: 13,
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Search produk */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          8,
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 8,
            padding:      '8px 12px',
            background:   '#fff',
            marginBottom: 14,
          }}>
            <Search size={14} color={COLOR.textMuted} />
            <input
              value={searchProduk}
              onChange={(e) => setSearchProduk(e.target.value)}
              placeholder="Cari produk atau SKU..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 13, background: 'transparent', fontFamily: 'inherit',
              }}
            />
            {searchProduk && (
              <button onClick={() => setSearchProduk('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <X size={13} color={COLOR.textMuted} />
              </button>
            )}
          </div>

          {/* Jumlah produk */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: COLOR.textSub }}>Pilih Produk</div>
            <span style={{ fontSize: 11, color: COLOR.textMuted }}>
              {loadingProduk ? 'Memuat...' : `Showing ${produkTampil.length} Items`}
            </span>
          </div>

          {/* Grid produk */}
          {loadingProduk ? (
            <div style={{ textAlign: 'center', color: COLOR.textMuted, fontSize: 13, padding: '40px 0' }}>
              <Loader size={20} color={COLOR.amber} />
              <div style={{ marginTop: 8 }}>Memuat produk...</div>
            </div>
          ) : (
            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap:                 isMobile ? 10 : 14,
            }}>
              {produkTampil.map((p) => (
                <ProductCard
                  key={p.sku}
                  produk={p}
                  onAdd={handleAddToCart}
                  isActive={selectedSku === p.sku}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Panel kanan: transaksi (desktop) ── */}
        {!isMobile && (
          <div
            className="no-scrollbar"
            style={{
              width:           360,
              flexShrink:      0,
              background:      COLOR.card,
              borderLeft:      `1px solid ${COLOR.border}`,
              display:         'flex',
              flexDirection:   'column',
              height:          '100%',
              overflowY:       'auto',
              scrollbarWidth:  'none',
              msOverflowStyle: 'none',
            }}
          >
            <TransaksiPanel
              keranjang={keranjang}
              setKeranjang={setKeranjang}
              handleUpdateQty={handleUpdateQty}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
              isMobile={false}
              onProses={handleProses}
              prosesLoading={prosesLoading}
              prosesError={prosesError}
            />
          </div>
        )}
      </div>

      {/* ── Floating cart button (mobile) ── */}
      {isMobile && keranjang.length > 0 && !showMobileCart && (
        <button
          onClick={() => setShowMobileCart(true)}
          style={{
            position:       'fixed',
            bottom:         20, left: 16, right: 16,
            background:     COLOR.amber,
            color:          '#fff',
            border:         'none',
            borderRadius:   12,
            padding:        '14px 20px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            boxShadow:      '0 4px 16px rgba(0,0,0,0.2)',
            cursor:         'pointer',
            fontFamily:     'inherit',
            zIndex:         15,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'rgba(255,255,255,0.25)', borderRadius: '50%',
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <ShoppingCart size={15} color="#fff" />
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#fff', color: COLOR.amber,
                fontSize: 10, fontWeight: 800,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Lihat Transaksi</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>{fmt(total)}</span>
        </button>
      )}

      {/* ── Modal cart (mobile) ── */}
      {isMobile && showMobileCart && (
        <div style={{
          position:      'fixed',
          inset:         0,
          background:    COLOR.card,
          zIndex:        30,
          display:       'flex',
          flexDirection: 'column',
          overflowY:     'auto',
        }}>
          <TransaksiPanel
            keranjang={keranjang}
            setKeranjang={setKeranjang}
            handleUpdateQty={handleUpdateQty}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            isMobile={true}
            onClose={() => setShowMobileCart(false)}
            onProses={handleProses}
            prosesLoading={prosesLoading}
            prosesError={prosesError}
          />
        </div>
      )}
    </div>
  )
}