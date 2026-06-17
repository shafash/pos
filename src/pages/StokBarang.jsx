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

export default function StokBarang({ onNav }) { 
  const [produk] = useState(produkListData)
  const [search, setSearch] = useState('')

  const filtered = produk.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Produk" value="1.240"           />
        <StatCard label="Stok Tipis"   value="12 Items"        />
        <StatCard label="Total Aset"   value="Rp. 540.000.000" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <SearchBar
              placeholder="Cari nama produk atau kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button style={{
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              padding:      '10px 14px',
              border:       `1px solid ${COLOR.border}`,
              borderRadius: 8,
              background:   '#fff',
              fontSize:     13,
              color:        COLOR.textSub,
              cursor:       'pointer',
              fontFamily:   'inherit',
            }}>
              <Filter size={14} /> Filter
            </button>
            <div style = {{marginLeft: 'auto'}}>
            <PrimaryBtn icon={Plus} onClick={() => onNav('tambahBarang')}>Tambah Barang</PrimaryBtn>
            </div>
          </div>

          <div style={{
            background:   COLOR.card,
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 12,
            overflow:     'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHeader cols={['No', 'Nama Produk', 'Kategori', 'Harga Beli', 'Harga Jual', 'Satuan', 'Aksi']} />
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{i + 1}.</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>
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
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.hargaBeli}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.hargaJual}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.satuan}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <ActionBtn icon={Pencil} onClick = {() => onNav('editBarang')} />
                        <ActionBtn icon={Trash2} color={COLOR.red} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{
            background:   '#4A3500',
            borderRadius: 12,
            padding:      20,
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
              }}
            >
              Mulai Opname
            </button>
          </div>

          <div style={{
            background:   COLOR.card,
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding:      20,
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
            {barangBaruData.map((b, i) => (
              <div key={i} style={{
                display:      'flex',
                alignItems:   'center',
                gap:          10,
                padding:      '8px 0',
                borderBottom: i < barangBaruData.length - 1 ? `1px solid ${COLOR.border}` : 'none',
              }}>
                <ProductImage width={36} height={28} />
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
  )
}