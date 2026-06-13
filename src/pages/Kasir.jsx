import { useState }      from 'react'
import { Package, ClipboardList, Users, Minus, Plus, Banknote, QrCode } from 'lucide-react'
import { COLOR }          from '../constants/colors'
import { kasirProdukData, keranjangInitData } from '../constants/mockData'
import { fmt }            from '../utils/format'
import Badge              from '../components/ui/Badge'
import ProductImage       from '../components/shared/ProductImage'

function ProductCard({ produk, onAdd, isActive }) {
  return (
    <div
      onClick={() => onAdd(produk)}
      style={{
        background:   isActive ? COLOR.amberLight : COLOR.card,
        border:       `2px solid ${isActive ? COLOR.amber : COLOR.border}`,
        borderRadius: 12,
        padding:      16,
        cursor:       'pointer',
        position:     'relative',
        transition:   'all 0.15s',
      }}
    >
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Badge color="amber">{produk.stok} Tersedia</Badge>
      </div>
      <div style={{
        height:         100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   12,
      }}>
        <ProductImage width={80} height={60} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{produk.nama}</div>
      <div style={{ fontSize: 12, color: COLOR.textMuted, marginBottom: 8 }}>{produk.tipe}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Badge color="gray">Eceran</Badge>
          <div style={{ fontSize: 13, marginTop: 4 }}>{fmt(produk.hargaEceran)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
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
      display:    'flex',
      alignItems: 'center',
      gap:        8,
      padding:    '8px 0',
      borderBottom: `1px solid ${COLOR.border}`,
    }}>
      <ProductImage width={36} height={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize:     11,
          fontWeight:   600,
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.nama}
        </div>
        <div style={{ fontSize: 10, color: COLOR.textMuted }}>{item.tipe}</div>
        <div style={{ fontSize: 11, color: COLOR.textSub }}>1 x {fmt(item.harga)}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onUpdateQty(item.id, -1)}
          style={{
            width:          22, height: 22,
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
        <span style={{ fontSize: 13, fontWeight: 700, width: 18, textAlign: 'center' }}>
          {item.qty}
        </span>
        <button
          onClick={() => onUpdateQty(item.id, 1)}
          style={{
            width:          22, height: 22,
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

export default function Kasir() {
  const [tab,      setTab]      = useState('produk')
  const [keranjang, setKeranjang] = useState(keranjangInitData)
  const [metode,   setMetode]   = useState('tunai')

  const subtotal = keranjang.reduce((s, i) => s + i.harga * i.qty, 0)
  const tax      = Math.round(subtotal * 0.03)
  const total    = subtotal + tax

  const handleAddToCart = (produk) => {
    setKeranjang(prev => {
      const exist = prev.find(x => x.id === produk.id)
      if (exist) return prev.map(x => x.id === produk.id ? { ...x, qty: x.qty + 1 } : x)
      return [...prev, { id: produk.id, nama: produk.nama, tipe: produk.tipe, harga: produk.hargaEceran, qty: 1 }]
    })
  }

  const handleUpdateQty = (id, delta) => {
    setKeranjang(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: COLOR.text, marginBottom: 20 }}>
          Kasir
        </h1>

        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
          Kategori Produk/Jasa
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { key: 'produk', label: 'Produk', icon: Package        },
            { key: 'jasa',   label: 'Jasa',   icon: ClipboardList  },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            6,
                padding:        '14px 24px',
                borderRadius:   10,
                border:         `2px solid ${tab === key ? COLOR.amber : COLOR.border}`,
                background:     tab === key ? COLOR.amberLight : COLOR.card,
                color:          tab === key ? COLOR.amberDark  : COLOR.textSub,
                cursor:         'pointer',
                fontWeight:     600,
                fontSize:       13,
                fontFamily:     'inherit',
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   12,
        }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Pilih Produk</div>
          <span style={{ fontSize: 12, color: COLOR.textMuted }}>
            Showing {kasirProdukData.length} Items
          </span>
        </div>
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 16,
        }}>
          {kasirProdukData.map((p, i) => (
            <ProductCard
              key={p.id}
              produk={p}
              onAdd={handleAddToCart}
              isActive={i === 0}
            />
          ))}
        </div>
      </div>

      <div style={{
        width:         300,
        background:    COLOR.card,
        borderLeft:    `1px solid ${COLOR.border}`,
        display:       'flex',
        flexDirection: 'column',
        position:      'sticky',
        top:           0,
        height:        '100vh',
        overflowY:     'auto',
        marginRight:   -32, 
      }}>

        <div style={{ padding: '20px 20px 12px', borderBottom: `1px solid ${COLOR.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Transaksi Detail</div>
            <span style={{ fontSize: 12, color: COLOR.textMuted }}>#TRX-001</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <div style={{
              width:          32, height: 32,
              background:     COLOR.amberLight,
              borderRadius:   '50%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <Users size={14} color={COLOR.amber} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Pelanggan Umum</div>
              <div style={{ fontSize: 11, color: COLOR.textMuted }}>Harga Eceran Normal</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 20px 8px', borderBottom: `1px solid ${COLOR.border}` }}>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   10,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Keranjang</div>
              <div style={{ fontSize: 12, color: COLOR.textMuted }}>{keranjang.length} Items</div>
            </div>
            <button
              onClick={() => setKeranjang([])}
              style={{
                background: 'none',
                border:     'none',
                color:      COLOR.red,
                fontSize:   12,
                fontWeight: 600,
                cursor:     'pointer',
                fontFamily: 'inherit',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {keranjang.map(item => (
              <KeranjangItem key={item.id} item={item} onUpdateQty={handleUpdateQty} />
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${COLOR.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Metode Pembayaran</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { key: 'tunai', label: 'Uang Tunai', icon: Banknote },
              { key: 'qris',  label: 'QRIS',       icon: QrCode   },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setMetode(key)}
                style={{
                  flex:           1,
                  padding:        '10px 8px',
                  borderRadius:   8,
                  border:         `2px solid ${metode === key ? COLOR.amber : COLOR.border}`,
                  background:     metode === key ? COLOR.amberLight : '#fff',
                  color:          metode === key ? COLOR.amberDark  : COLOR.textSub,
                  cursor:         'pointer',
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  gap:            4,
                  fontSize:       11,
                  fontWeight:     600,
                  fontFamily:     'inherit',
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: COLOR.textSub, marginBottom: 6 }}>Total Dibayar</div>
            <div style={{
              background:   '#F7F7F5',
              borderRadius: 8,
              padding:      '10px 14px',
              fontSize:     14,
              fontWeight:   700,
            }}>
              {fmt(total)}
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 20px', flex: 1 }}>
          {[
            ['Amount',   `${keranjang.reduce((s, i) => s + i.qty, 0)} (Items)`],
            ['Subtotal', fmt(subtotal)],
            ['Tax (3%)', fmt(tax)],
          ].map(([label, val]) => (
            <div key={label} style={{
              display:        'flex',
              justifyContent: 'space-between',
              fontSize:       12,
              marginBottom:   6,
            }}>
              <span style={{ color: COLOR.textSub }}>{label}</span>
              <span>{val}</span>
            </div>
          ))}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            fontSize:       14,
            fontWeight:     800,
            marginTop:      8,
          }}>
            <span>Total</span>
            <span style={{ color: COLOR.amber }}>{fmt(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
            <span style={{ color: COLOR.textSub }}>Bayar</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
            <span style={{ color: COLOR.textSub }}>Kembali</span>
            <span>{fmt(Math.max(0, subtotal - total))}</span>
          </div>
        </div>

        <div style={{ padding: '12px 20px 24px' }}>
          <button style={{
            width:        '100%',
            background:   COLOR.amber,
            color:        '#fff',
            border:       'none',
            borderRadius: 10,
            padding:      14,
            fontWeight:   800,
            fontSize:     14,
            cursor:       'pointer',
            fontFamily:   'inherit',
          }}>
            Proses Transaksi
          </button>
        </div>
      </div>
    </div>
  )
}
