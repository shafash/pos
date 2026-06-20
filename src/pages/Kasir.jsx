import { useState } from 'react'
import { Package, ClipboardList, Users, Minus, Plus, Banknote, QrCode, ShoppingCart, X } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { kasirProdukData, keranjangInitData } from '../constants/mockData'
import { fmt } from '../utils/format'
import Badge from '../components/ui/Badge'
import ProductImage from '../components/shared/ProductImage'
import { useIsMobile } from '../hooks/useIsMobile'

function ProductCard({ produk, onAdd, isActive, isMobile }) {
  return (
    <div
      onClick={() => onAdd(produk)}
      style={{
        background:   isActive ? COLOR.amberLight : COLOR.card,
        border:       `2px solid ${isActive ? COLOR.amber : COLOR.border}`,
        borderRadius: 12,
        padding:      isMobile ? 12 : 16,
        cursor:       'pointer',
        position:     'relative',
        transition:   'all 0.15s',
      }}
    >
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Badge color="amber">{produk.stok} Tersedia</Badge>
      </div>
      <div style={{
        height:         isMobile ? 80 : 100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   12,
      }}>
        <ProductImage width={isMobile ? 60 : 80} height={isMobile ? 45 : 60} />
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
        {produk.nama}
      </div>
      <div style={{ fontSize: 12, color: COLOR.textMuted, marginBottom: 8 }}>{produk.tipe}</div>
      <div style={{
        display:        'flex',
        flexDirection:  isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems:     isMobile ? 'flex-start' : 'flex-end',
        gap:            isMobile ? 6 : 0,
      }}>
        <div>
          <Badge color="gray">Eceran</Badge>
          <div style={{ fontSize: 13, marginTop: 4 }}>{fmt(produk.hargaEceran)}</div>
        </div>
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <span style={{ color: COLOR.amber, fontWeight: 600, fontSize: 12 }}>Grosir</span>
          <div style={{ color: COLOR.amber, fontWeight: 700, fontSize: 13 }}>
            {fmt(produk.hargaGrosir)}
          </div>
        </div>
      </div>
    </div>
  )
}

function KeranjangItem({ item, onUpdateQty }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          10,
      padding:      '10px 0',
      borderBottom: `1px solid ${COLOR.border}`,
    }}>
      <ProductImage width={36} height={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize:     12,
          fontWeight:   600,
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.nama}
        </div>
        <div style={{ fontSize: 11, color: COLOR.textMuted }}>{item.tipe}</div>
        <div style={{ fontSize: 11, color: COLOR.textSub }}>1 x {fmt(item.harga)}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => onUpdateQty(item.id, -1)}
          style={{
            width:          24, height: 24,
            border:         `1px solid ${COLOR.border}`,
            borderRadius:   4,
            background:     '#fff',
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <Minus size={10} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, width: 20, textAlign: 'center' }}>
          {item.qty}
        </span>
        <button
          onClick={() => onUpdateQty(item.id, 1)}
          style={{
            width:          24, height: 24,
            border:         'none',
            borderRadius:   4,
            background:     COLOR.amber,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={10} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ── Komponen isi panel transaksi (dipakai di desktop sidebar & mobile modal) ──
function TransaksiPanel({ keranjang, setKeranjang, metode, setMetode, handleUpdateQty, isMobile, onClose }) {
  const subtotal = keranjang.reduce((s, i) => s + i.harga * i.qty, 0)
  const tax      = Math.round(subtotal * 0.03)
  const total    = subtotal + tax

  return (
    <>
      {/* Header Transaksi */}
      <div style={{ padding: isMobile ? '16px 16px 14px' : '20px 24px 14px', borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Transaksi Detail</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: COLOR.textMuted }}>#TRX-001</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <div style={{
            width: 34, height: 34, background: COLOR.amberLight, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={15} color={COLOR.amber} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Pelanggan Umum</div>
            <div style={{ fontSize: 11, color: COLOR.textMuted }}>Harga Eceran Normal</div>
          </div>
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
          {keranjang.map(item => (
            <KeranjangItem key={item.id} item={item} onUpdateQty={handleUpdateQty} />
          ))}
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div style={{ padding: isMobile ? '14px 16px' : '14px 24px', borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Metode Pembayaran</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { key: 'tunai', label: 'Uang Tunai', icon: Banknote },
            { key: 'qris',  label: 'QRIS',       icon: QrCode   },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMetode(key)}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 8,
                border: `2px solid ${metode === key ? COLOR.amber : COLOR.border}`,
                background: metode === key ? COLOR.amberLight : '#fff',
                color: metode === key ? COLOR.amberDark : COLOR.textSub,
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: COLOR.textSub, marginBottom: 6 }}>Total Dibayar</div>
          <div style={{ background: '#F7F7F5', borderRadius: 8, padding: '12px 16px', fontSize: 15, fontWeight: 700 }}>
            {fmt(total)}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: isMobile ? '14px 16px' : '14px 24px', flex: 1 }}>
        {[
          ['Amount',   `${keranjang.reduce((s, i) => s + i.qty, 0)} (Items)`],
          ['Subtotal', fmt(subtotal)],
          ['Tax (3%)', fmt(tax)],
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
      </div>

      {/* CTA */}
      <div style={{ padding: isMobile ? '12px 16px 24px' : '12px 24px 28px' }}>
        <button style={{
          width: '100%', background: COLOR.amber, color: '#fff', border: 'none',
          borderRadius: 10, padding: 16, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Proses Transaksi
        </button>
      </div>
    </>
  )
}

export default function Kasir() {
  const [tab,           setTab]           = useState('produk')
  const [keranjang,     setKeranjang]     = useState(keranjangInitData)
  const [metode,        setMetode]        = useState('tunai')
  const [selectedId,    setSelectedId]    = useState(null)
  const [showMobileCart, setShowMobileCart] = useState(false)   // ← state modal mobile

  const isMobile = useIsMobile()

  const subtotal   = keranjang.reduce((s, i) => s + i.harga * i.qty, 0)
  const totalItems = keranjang.reduce((s, i) => s + i.qty, 0)
  const tax         = Math.round(subtotal * 0.03)
  const total       = subtotal + tax

  const handleAddToCart = (produk) => {
    setSelectedId(produk.id)
    setKeranjang(prev => {
      const exist = prev.find(x => x.id === produk.id)
      if (exist) return prev.map(x => x.id === produk.id ? { ...x, qty: x.qty + 1 } : x)
      return [...prev, { id: produk.id, nama: produk.nama, tipe: produk.tipe, harga: produk.hargaEceran, qty: 1 }]
    })
    if (isMobile) setShowMobileCart(true)   // ← otomatis buka panel pas nambah produk pertama (opsional)
  }

  const handleUpdateQty = (id, delta) => {
    setKeranjang(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height:        isMobile ? 'auto' : 'calc(100vh - 56px)',
        minHeight:     isMobile ? 'calc(100vh - 56px)' : 'auto',
        overflow:      isMobile ? 'visible' : 'hidden',
        paddingTop:    isMobile ? 16 : 24,
      }}>

        {/* ── Kolom Kiri: Produk ───────────────── */}
        <div
          className="no-scrollbar"
          style={{
            flex:            1,
            overflowY:       isMobile ? 'visible' : 'auto',
            paddingRight:    isMobile ? 16 : 24,
            paddingLeft:     isMobile ? 16 : 0,
            paddingBottom:   isMobile ? 90 : 0,   // ← ruang biar gak ketutup floating button
            height:          isMobile ? 'auto' : '100%',
            scrollbarWidth:  'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Kategori Tabs */}
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
            Kategori Produk/Jasa
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
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
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    gap:           6,
                    padding:       isMobile ? '10px 16px' : '12px 22px',
                    flex:          isMobile ? 1 : 'none',
                    borderRadius:  10,
                    border:        `2px solid ${isActive ? COLOR.amber : COLOR.border}`,
                    background:    '#fff',
                    color:         isActive ? COLOR.amber : COLOR.textSub,
                    cursor:        'pointer',
                    fontWeight:    600,
                    fontSize:      13,
                    fontFamily:    'inherit',
                    transition:    'all 0.15s',
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Pilih Produk */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: COLOR.textSub }}>Pilih Produk</div>
            <span style={{ fontSize: 11, color: COLOR.textMuted }}>
              Showing {kasirProdukData.length} Items
            </span>
          </div>
          <div style={{
            display:             'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap:                 isMobile ? 10 : 14,
          }}>
            {kasirProdukData.map((p) => (
              <ProductCard
                key={p.id}
                produk={p}
                onAdd={handleAddToCart}
                isActive={selectedId === p.id}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* ── Kolom Kanan: Transaksi Detail (DESKTOP ONLY) ── */}
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
              metode={metode}
              setMetode={setMetode}
              handleUpdateQty={handleUpdateQty}
              isMobile={false}
            />
          </div>
        )}
      </div>

      {/* ── Floating Button (MOBILE ONLY) ──────── */}
      {isMobile && keranjang.length > 0 && !showMobileCart && (
        <button
          onClick={() => setShowMobileCart(true)}
          style={{
            position:       'fixed',
            bottom:         20,
            left:           16,
            right:          16,
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
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '50%',
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

      {/* ── Modal Full Screen Transaksi (MOBILE ONLY) ── */}
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
            metode={metode}
            setMetode={setMetode}
            handleUpdateQty={handleUpdateQty}
            isMobile={true}
            onClose={() => setShowMobileCart(false)}
          />
        </div>
      )}
    </div>
  )
}