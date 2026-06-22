import { useState } from 'react'
import { UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { memberListData } from '../constants/mockData'
import StatCard from '../components/ui/StatCard'
import TableHeader from '../components/ui/TableHeader'
import SearchBar from '../components/ui/SearchBar'
import PrimaryBtn from '../components/ui/PrimaryBtn'
import ActionBtn from '../components/ui/ActionBtn'
import { useIsMobile } from '../hooks/useIsMobile'

export default function DataMember({ onNav }) {
  const [members]     = useState(memberListData)
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)

  const isMobile    = useIsMobile()       // < 768
  const isBelow1024 = useIsMobile(1024)   // < 1024
  const isTablet    = isBelow1024 && !isMobile // 768–1024
  const isStacked   = isMobile || isTablet     // mobile & tablet

  const filtered = members.filter(m =>
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.memberId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ paddingTop: isMobile ? 16 : 24 }}>

      {/* ── Stat Cards ───────────────────────── */}
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        {isStacked ? (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <StatCard label="Total Member" value="450" sub="Seluruh Database" compact />
              <StatCard label="Member Aktif" value="234" sub="+6 Member bulan ini" compact />
            </div>
            <StatCard label="Poin Terbanyak" value="8.500 Poin" sub="An. Keizuro Isaac" compact />
          </>
        ) : (
          <div style={{ display: 'flex', gap: 16 }}>
            <StatCard label="Total Member"   value="450"        sub="Seluruh Database"    />
            <StatCard label="Member Aktif"   value="234"        sub="+6 Member bulan ini" />
            <StatCard label="Poin Terbanyak" value="8.500 Poin" sub="An. Keizuro Isaac"   />
          </div>
        )}
      </div>

      {/* ── Toolbar ──────────────────────────── */}
      <div style={{
        display:        'flex',
        flexDirection:  isStacked ? 'column' : 'row',
        gap:            12,
        justifyContent: isStacked ? undefined : 'space-between',
        alignItems:     isStacked ? 'stretch' : 'center',
        marginBottom:   isMobile ? 16 : 20,
      }}>
        <div style={{ flex: isStacked ? undefined : 1, minWidth: 0, maxWidth: isStacked ? undefined : 360 }}>
          <SearchBar
            placeholder="Cari nama atau ID Member..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ width: isStacked ? '100%' : undefined }}>
          <PrimaryBtn
            icon={UserPlus}
            onClick={() => onNav('tambahMember')}
            style={isStacked ? { width: '100%' } : {}}
          >
            Tambah Member
          </PrimaryBtn>
        </div>
      </div>

      {/* ── Table ────────────────────────────── */}
      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        overflow:     'hidden',
      }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isStacked ? 720 : 'auto' }}>
            <TableHeader cols={['No', 'ID Member', 'Nama', 'No.Telepon', 'Alamat', 'Poin', 'Aksi']} />
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{i + 1}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: COLOR.textSub, whiteSpace: 'nowrap' }}>
                    {m.memberId}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {m.nama}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{m.telp}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: COLOR.textSub, maxWidth: 200 }}>
                    {m.alamat}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {m.poin.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <ActionBtn icon={Pencil} onClick={() => onNav('editMember')} />
                      <ActionBtn icon={Trash2} color={COLOR.red} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ───────────────────────── */}
        <div style={{
          padding:        '14px 16px',
          display:        'flex',
          flexDirection:  isMobile ? 'column' : 'row',
          gap:            isMobile ? 10 : 0,
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems:     'center',
          borderTop:      `1px solid ${COLOR.border}`,
        }}>
          {!isMobile && (
            <span style={{ fontSize: 12, color: COLOR.textMuted }}>
              Menampilkan {filtered.length} dari 400 member
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{
                width:          30, height: 30,
                border:         `1px solid ${COLOR.border}`,
                borderRadius:   6,
                background:     '#fff',
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  width:        30, height: 30,
                  border:       `1px solid ${page === n ? COLOR.amber : COLOR.border}`,
                  borderRadius: 6,
                  background:   page === n ? COLOR.amber : '#fff',
                  color:        page === n ? '#fff' : COLOR.text,
                  cursor:       'pointer',
                  fontWeight:   page === n ? 700 : 400,
                  fontSize:     13,
                  fontFamily:   'Geist',
                  flexShrink:   0,
                }}
              >
                {n}
              </button>
            ))}
            <span style={{ color: COLOR.textMuted, fontSize: 12 }}>—</span>
            <button
              onClick={() => setPage(p => p + 1)}
              style={{
                width:          30, height: 30,
                border:         `1px solid ${COLOR.border}`,
                borderRadius:   6,
                background:     '#fff',
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}