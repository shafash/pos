import { useState } from 'react'
import { Search, ChevronDown, Upload } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { laporanBulananData } from '../constants/mockData'
import { fmt } from '../utils/format'
import StatCard from '../components/ui/StatCard'
import TableHeader from '../components/ui/TableHeader'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const laporanHarianData = Array.from({ length: 6 }, (_, i) => ({
  tanggal:    `0${i + 1} Jun 2026`,
  transaksi:  40 + i * 3,
  pendapatan: 1200000 + i * 100000,
  pajak:      36000 + i * 3000,
  bersih:     1164000 + i * 97000,
}))

const TABLE_COLS = ['Tanggal', 'Total Transaksi', 'Pendapatan', 'Pajak', 'Bersih']

const CABANG_OPTIONS = ['Semua Cabang', 'Cabang Utama', 'Cabang 2', 'Cabang 3']

export default function Laporan() {
  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)   
  const isTablet    = isBelow1024 && !isMobile 
  const isStacked   = isMobile || isTablet  

  const [search, setSearch] = useState('')
  const [cabang, setCabang] = useState('Semua Cabang')

  const filtered = laporanHarianData.filter(row =>
    row.tanggal.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    console.log('Export PDF', { search, cabang })
  }

  return (
    <div style={{ paddingTop: isMobile ? 16 : 24 }}>

      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        {isStacked ? (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <StatCard label="Total Pendapatan" value="Rp. 45.000.000" sub="Bulan ini" compact />
              <StatCard label="Transaksi" value="1.245" sub="Total bulan ini" compact />
            </div>
            <StatCard label="Rata-rata/Hari" value="Rp. 1.500.000" sub="30 hari terakhir" compact />
          </>
        ) : (
          <div style={{ display: 'flex', gap: 16 }}>
            <StatCard label="Total Pendapatan" value="Rp. 45.000.000" sub="Bulan ini"        />
            <StatCard label="Transaksi"        value="1.245"          sub="Total bulan ini"   />
            <StatCard label="Rata-rata/Hari"   value="Rp. 1.500.000"  sub="30 hari terakhir" />
          </div>
        )}
      </div>

      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      isMobile ? 16 : 24,
        marginBottom: isMobile ? 16 : 20,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Pendapatan Bulanan
        </div>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
          <AreaChart
            data={laporanBulananData}
            margin={isMobile ? { top: 4, right: 8, left: 0, bottom: 24 } : undefined}
          >
            <defs>
              <linearGradient id="laporanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLOR.amber} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR.amber} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 40 : 30}
              interval={isMobile ? 'preserveStartEnd' : 0}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 36 : 60}
            />
            <Tooltip formatter={v => fmt(v)} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLOR.amber}
              strokeWidth={2}
              fill="url(#laporanGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        overflow:     'hidden',
      }}>

        <div style={{
          display:        'flex',
          flexDirection:  isStacked ? 'column' : 'row',
          justifyContent: isStacked ? undefined : 'space-between',
          alignItems:     isStacked ? 'stretch' : 'center',
          gap:            12,
          padding:        isMobile ? 16 : 20,
          borderBottom:   `1px solid ${COLOR.border}`,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
            Laporan Harian
          </div>

          <div style={{
            display:       'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap:           10,
            width:         isStacked ? '100%' : undefined,
          }}>
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              padding:      '8px 12px',
              border:       `1px solid ${COLOR.border}`,
              borderRadius: 8,
              background:   '#fff',
              flex:         isMobile ? undefined : '1 1 200px',
              minWidth:     0,
            }}>
              <Search size={14} color={COLOR.textMuted} style={{ flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari Transaksi..."
                style={{
                  border:      'none',
                  outline:     'none',
                  fontSize:    13,
                  fontFamily:  'inherit',
                  width:       '100%',
                  color:       COLOR.text,
                  background:  'transparent',
                }}
              />
            </div>

            <div style={{
              position:     'relative',
              flexShrink:   0,
            }}>
              <select
                value={cabang}
                onChange={e => setCabang(e.target.value)}
                style={{
                  appearance:   'none',
                  width:        isMobile ? '100%' : 'auto',
                  padding:      '8px 32px 8px 12px',
                  border:       `1px solid ${COLOR.border}`,
                  borderRadius: 8,
                  background:   '#fff',
                  fontSize:     13,
                  color:        COLOR.textSub,
                  cursor:       'pointer',
                  fontFamily:   'inherit',
                }}
              >
                {CABANG_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                color={COLOR.textMuted}
                style={{
                  position:      'absolute',
                  right:         10,
                  top:           '50%',
                  transform:     'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <button
              onClick={handleExport}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            6,
                padding:        '8px 16px',
                border:         'none',
                borderRadius:   8,
                background:     COLOR.amber,
                color:          '#fff',
                fontSize:       13,
                fontWeight:     700,
                cursor:         'pointer',
                fontFamily:     'inherit',
                whiteSpace:     'nowrap',
                flexShrink:     0,
              }}
            >
              <Upload size={14} />
              Export PDF
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isStacked ? 640 : 'auto' }}>
            <TableHeader cols={TABLE_COLS} />
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{row.tanggal}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{row.transaksi}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{fmt(row.pendapatan)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{fmt(row.pajak)}</td>
                  <td style={{
                    padding:    '12px 16px',
                    fontSize:   13,
                    fontWeight: 700,
                    color:      COLOR.accent,
                    whiteSpace: 'nowrap',
                  }}>
                    {fmt(row.bersih)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}