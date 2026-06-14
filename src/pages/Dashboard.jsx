import { ChevronDown } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { COLOR } from '../constants/colors'
import {
  omsetData, cabangData, stokMenipisData, transaksiTerakhirData,
} from '../constants/mockData'
import StatCard     from '../components/ui/StatCard'
import Badge        from '../components/ui/Badge'
import TableHeader  from '../components/ui/TableHeader'

export default function Dashboard() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Omset"          value="2.000.000"  sub="Total semua cabang"      />
        <StatCard label="Total Transaksi" value="123"       sub="Struk tercetak hari ini" />
        <StatCard label="Member Aktif"   value="234"        sub="+6 Member bulan ini"     />
        <StatCard label="Stok Kritis"    value="3 Item"     sub="Perlu restock segera"    />
      </div>

      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      24,
        marginBottom: 24,
      }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   20,
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Omset</span>
          <div style={{
            display:     'flex',
            alignItems:  'center',
            gap:         6,
            fontSize:    13,
            color:       COLOR.textSub,
            cursor:      'pointer',
            border:      `1px solid ${COLOR.border}`,
            borderRadius: 6,
            padding:     '4px 10px',
          }}>
            Yearly <ChevronDown size={14} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={omsetData}>
            <defs>
              <linearGradient id="omsetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLOR.amber} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR.amber} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: COLOR.textMuted }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: COLOR.textMuted }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLOR.amber}
              strokeWidth={2}
              fill="url(#omsetGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 16,
        marginBottom:        24,
      }}>

        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding:      24,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Performa Cabang
          </div>
          {cabangData.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                fontSize:       13,
                marginBottom:   4,
              }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: COLOR.textSub }}>{c.value} JT</span>
              </div>
              <div style={{
                height:     24,
                background: COLOR.amberLight,
                borderRadius: 6,
                overflow:   'hidden',
              }}>
                <div style={{
                  height:      '100%',
                  background:  COLOR.amber,
                  borderRadius: 6,
                  width:       `${(c.value / 120) * 100}%`,
                  display:     'flex',
                  alignItems:  'center',
                  paddingLeft: 10,
                  transition:  'width 0.4s',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#7A4500' }}>
                    {c.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding:      24,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Stok Menipis
          </div>
          {stokMenipisData.map((s, i) => (
            <div
              key={i}
              style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                padding:        '9px 0',
                borderBottom:   i < stokMenipisData.length - 1 ? `1px solid ${COLOR.border}` : 'none',
              }}
            >
              <span style={{ fontSize: 13 }}>{s.nama}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge color={s.critical ? 'red' : 'amber'}>• {s.unit} unit</Badge>
                <span style={{ fontSize: 12, color: COLOR.textMuted }}>{s.cabang}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Transaksi Terakhir
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['No', 'Waktu', 'Jumlah', 'Harga', 'Total']} />
          <tbody>
            {transaksiTerakhirData.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                {[t.id, t.waktu, t.jumlah, t.harga, t.total].map((val, j) => (
                  <td key={j} style={{ padding: '12px 16px', fontSize: 13, color: COLOR.text }}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
