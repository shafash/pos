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

export default function StokBarang({ onNav }) {
  const [produk] = useState(produkListData)
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()

  const filtered = produk.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ paddingTop: isMobile ? 16 : 24 }}>

      {/* ── Stat Cards ───────────────────────── */}
      <div style={{
        display:             isMobile ? 'grid' : 'flex',
        gridTemplateColumns: isMobile ? '1fr' : undefined,
        gap:                 isMobile ? 12 : 16,
        marginBottom:        isMobile ? 16 : 24,
      }}>
        <StatCard label="Total Produk" value="1.240"           />
        <StatCard label="Stok Tipis"   value="12 Items"        />
        <StatCard label="Total Aset"   value="Rp. 540.000.000" />
      </div>

      <div style={{
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        gap:                 isMobile ? 16 : 20,
      }}>

        {/* ── Tabel Produk ─────────────────────── */}
        <div>
          <div style={{
            display:       'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap:           12,
            marginBottom:  16,
            alignItems:    isMobile ? 'stretch' : 'center',
          }}>
            <SearchBar
              placeholder="Cari nama produk atau kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                gap:          6,
                padding:      '10px 14px',
                border:       `1px solid ${COLOR.border}`,
                borderRadius: 8,
                background:   '#fff',
                fontSize:     13,
                color:        COLOR.textSub,
                cursor:       'pointer',
                fontFamily:   'inherit',
                flex:         isMobile ? 1 : 'none',
              }}>
                <Filter size={14} /> Filter
              </button>
              <div style={{ marginLeft: isMobile ? 0 : 'auto', flex: isMobile ? 1 : 'none' }}>
                <PrimaryBtn icon={Plus} onClick={() => onNav('tambahBarang')}>
                  {isMobile ? 'Tambah' : 'Tambah Barang'}
                </PrimaryBtn>
              </div>
            </div>
          </div>

          <div style={{
            background:   COLOR.card,
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 12,
            overflow:     'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 640 : 'auto' }}>
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
        </div>

        {/* ── Sidebar Kanan ────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Audit Stok */}
          <div style={{
            background:   '#4A3500',
            borderRadius: 12,
            padding:      isMobile ? 16 : 20,
            color:        '#fff',
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

          {/* Barang Baru */}
          <div style={{
            background:   COLOR.card,
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding:      isMobile ? 16 : 20,
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
              display:             isMobile ? 'grid' : 'block',
              gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
              gap:                 isMobile ? 12 : 0,
            }}>
              {barangBaruData.map((b, i) => (
                <div key={i} style={{
                  display:      'flex',
                  alignItems:   isMobile ? 'flex-start' : 'center',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap:          isMobile ? 6 : 10,
                  padding:      isMobile ? 0 : '8px 0',
                  borderBottom: (!isMobile && i < barangBaruData.length - 1) ? `1px solid ${COLOR.border}` : 'none',
                }}>
                  <ProductImage width={isMobile ? 48 : 36} height={isMobile ? 36 : 28} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{b.nama}</div>
                    <div style={{ fontSize: 11, color: COLOR.textMuted }}>Stok: {b.stok} Pcs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}