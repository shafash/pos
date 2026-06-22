import { useState }    from 'react'
import { Filter, Plus, Pencil, Trash2 } from 'lucide-react'
import { COLOR }        from '../constants/colors'
import { produkListData, barangBaruData } from '../constants/mockData'
import StatCard         from '../components/ui/StatCard'
import Badge            from '../components/ui/Badge'
import TableHeader      from '../components/ui/TableHeader'
import SearchBar        from '../components/ui/SearchBar'
import PrimaryBtn       from '../components/ui/PrimaryBtn'
import ActionBtn        from '../components/ui/ActionBtn'
import ProductImage     from '../components/shared/ProductImage'
import { useIsMobile }  from '../hooks/useIsMobile'

// Singkat angka rupiah jadi format compact, contoh: 540000000 -> "540Jt"
function formatRupiahSingkat(value) {
  const num = Number(String(value).replace(/[^\d]/g, ''))
  if (isNaN(num)) return value
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1)}M`
  if (num >= 1_000_000)     return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}Jt`
  if (num >= 1_000)         return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}Rb`
  return String(num)
}

export default function StokBarang({ onNav }) {
  const [produk] = useState(produkListData)
  const [search, setSearch] = useState('')

  const isMobile     = useIsMobile()       // < 768
  const isBelow1024  = useIsMobile(1024)   // < 1024
  const isTablet     = isBelow1024 && !isMobile // 768–1024
  const isStacked    = isMobile || isTablet     // mobile & tablet

  const filtered = produk.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  const totalAsetRaw = 540000000
  const totalAsetLabel = isStacked
    ? `Rp ${formatRupiahSingkat(totalAsetRaw)}`
    : 'Rp. 540.000.000'

  // ── Blok-blok konten, disusun ulang urutannya tergantung breakpoint ──

  const statCardsBlock = (
    <div style={{
      display: 'flex',
      gap:     isStacked ? 8 : 16,
      marginBottom: isMobile ? 16 : 24,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <StatCard
          label={isStacked ? 'Total Produk' : 'Total Produk'}
          value="1.240"
          compact={isStacked}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <StatCard
          label="Stok Tipis"
          value="12 Items"
          compact={isStacked}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <StatCard
          label="Total Aset"
          value={totalAsetLabel}
          compact={isStacked}
        />
      </div>
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
            placeholder="Cari nama produk atau kode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            6,
          padding:        '10px 14px',
          border:         `1px solid ${COLOR.border}`,
          borderRadius:   8,
          background:     '#fff',
          fontSize:       13,
          color:          COLOR.textSub,
          cursor:         'pointer',
          fontFamily:     'inherit',
          whiteSpace:     'nowrap',
          flexShrink:     0,
        }}>
          <Filter size={14} /> Filter
        </button>

        {/* Desktop: tombol tambah nempel di ujung kanan baris yang sama */}
        {!isStacked && (
          <div style={{ marginLeft: 'auto' }}>
            <PrimaryBtn icon={Plus} onClick={() => onNav('tambahBarang')}>
              Tambah Barang
            </PrimaryBtn>
          </div>
        )}
      </div>

      {/* Mobile & Tablet: tombol tambah baris baru, full width */}
      {isStacked && (
        <div style={{ width: '100%' }}>
          <PrimaryBtn
            icon={Plus}
            onClick={() => onNav('tambahBarang')}
            style={{ width: '100%', justifyContent: 'center' }}
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
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 640 : 720 }}>
          <TableHeader cols={['No', 'Nama Produk', 'Kategori', 'Harga Beli', 'Harga Jual', 'Satuan', 'Aksi']} />
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{i + 1}.</td>
                <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ProductImage width={28} height={22} />
                    {p.nama}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge color={p.kategori === 'Basah' ? 'amber' : 'gray'}>
                    {p.kategori}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{p.hargaBeli}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{p.hargaJual}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.satuan}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <ActionBtn icon={Pencil} onClick={() => onNav('editBarang')} />
                    <ActionBtn icon={Trash2} color={COLOR.red} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <span style={{ color: COLOR.amber, fontSize: 12, cursor: 'pointer' }}>
          Lihat Semua
        </span>
      </div>
      <div style={{
        display:             isStacked ? 'grid' : 'block',
        gridTemplateColumns: isStacked ? '1fr 1fr' : undefined,
        gap:                 isStacked ? 12 : 0,
      }}>
        {barangBaruData.map((b, i) => (
          <div key={i} style={{
            display:       'flex',
            alignItems:    isStacked ? 'flex-start' : 'center',
            flexDirection: isStacked ? 'column' : 'row',
            gap:           isStacked ? 6 : 10,
            padding:       isStacked ? 0 : '8px 0',
            borderBottom:  (!isStacked && i < barangBaruData.length - 1) ? `1px solid ${COLOR.border}` : 'none',
          }}>
            <ProductImage width={isStacked ? 48 : 36} height={isStacked ? 36 : 28} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{b.nama}</div>
              <div style={{ fontSize: 11, color: COLOR.textMuted }}>Stok: {b.stok} Pcs</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── Render: urutan beda untuk stacked (mobile/tablet) vs desktop ──

  if (isStacked) {
    return (
      <div style={{ paddingTop: isMobile ? 16 : 24 }}>
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