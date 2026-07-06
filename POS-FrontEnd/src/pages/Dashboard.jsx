import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { COLOR } from '../constants/colors'
import { dashboardService } from '../services/api'
import { useApi } from '../hooks/useApi'
import StatCard    from '../components/ui/StatCard'
import Badge       from '../components/ui/Badge'
import TableHeader from '../components/ui/TableHeader'
import { useIsMobile } from '../hooks/useIsMobile'

function formatRupiah(value) {
  if (!value && value !== 0) return '-'
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} M`
  if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1)} JT`
  if (value >= 1_000)         return `${(value / 1_000).toFixed(0)} RB`
  return value.toLocaleString('id-ID')
}

export default function Dashboard() {
  const isMobile = useIsMobile()

  const [tahun, setTahun] = useState(new Date().getFullYear())

  const { data, loading, error, execute } = useApi(dashboardService.get)

  useEffect(() => {
    execute({ tahun })
  }, [tahun])

  const ringkasan        = data?.ringkasan         ?? {}
  const omsetBulanan     = data?.omset_bulanan      ?? []
  const penjualanCabang  = data?.penjualan_cabang   ?? []
  const stokMenipis      = data?.stok_menipis       ?? []
  const transaksiTerakhir= data?.transaksi_terakhir ?? []

  const maxPenjualan = Math.max(...penjualanCabang.map(c => c.value), 1)

  return (
    <div style={{ paddingTop: isMobile ? 16 : 24 }}>

      {error && (
        <div style={{
          background:   '#FEF2F2',
          border:       '1px solid #FECACA',
          borderRadius: 8,
          padding:      '10px 16px',
          marginBottom: 16,
          fontSize:     13,
          color:        '#DC2626',
        }}>
          Gagal memuat data: {error}
        </div>
      )}

      <div style={{
        display:             isMobile ? 'grid' : 'flex',
        gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
        gap:                 isMobile ? 12 : 16,
        marginBottom:        isMobile ? 16 : 24,
        flexWrap:            'wrap',
      }}>
        <StatCard
          label="Omset Hari Ini"
          value={loading ? '...' : `Rp ${formatRupiah(ringkasan.omset_hari_ini ?? 0)}`}
          sub="Total semua cabang"
        />
        <StatCard
          label="Total Transaksi"
          value={loading ? '...' : String(ringkasan.transaksi_hari_ini ?? 0)}
          sub="Struk tercetak hari ini"
        />
        <StatCard
          label="Member Aktif"
          value={loading ? '...' : String(ringkasan.total_member_aktif ?? 0)}
          sub="Total member aktif"
        />
        <StatCard
          label="Stok Kritis"
          value={loading ? '...' : `${stokMenipis.length} Item`}
          sub="Perlu restock segera"
        />
      </div>

      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      isMobile ? 16 : 24,
        marginBottom: isMobile ? 16 : 24,
      }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   isMobile ? 14 : 20,
          flexWrap:       'wrap',
          gap:            8,
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Omset {tahun}</span>

          {/* Dropdown ganti tahun */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[new Date().getFullYear() - 1, new Date().getFullYear()].map((yr) => (
              <button
                key={yr}
                onClick={() => setTahun(yr)}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          4,
                  fontSize:     13,
                  color:        tahun === yr ? COLOR.amber : COLOR.textSub,
                  cursor:       'pointer',
                  border:       `1px solid ${tahun === yr ? COLOR.amber : COLOR.border}`,
                  borderRadius: 6,
                  padding:      '4px 10px',
                  background:   'transparent',
                  fontWeight:   tahun === yr ? 700 : 400,
                }}
              >
                {yr} {tahun === yr && <ChevronDown size={14} />}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: isMobile ? 160 : 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLOR.textMuted, fontSize: 13 }}>
            Memuat grafik...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
            <AreaChart data={omsetBulanan}>
              <defs>
                <linearGradient id="omsetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLOR.amber} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={COLOR.amber} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
              <XAxis
                dataKey="bulan"
                tick={{ fontSize: isMobile ? 9 : 11, fill: COLOR.textMuted }}
                axisLine={false}
                tickLine={false}
                interval={isMobile ? 1 : 0}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 9 : 11, fill: COLOR.textMuted }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 32 : 40}
                tickFormatter={(v) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(0)}JT` : v}
              />
              <Tooltip
                formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omset']}
              />
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
        )}
      </div>

      {/* ── Performa Cabang + Stok Menipis ──────────────────── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap:                 16,
        marginBottom:        isMobile ? 16 : 24,
      }}>

        {/* Performa Cabang */}
        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding:      isMobile ? 16 : 24,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Performa Cabang
          </div>

          {loading ? (
            <div style={{ color: COLOR.textMuted, fontSize: 13 }}>Memuat...</div>
          ) : penjualanCabang.length === 0 ? (
            <div style={{ color: COLOR.textMuted, fontSize: 13 }}>
              Belum ada data transaksi tahun ini.
            </div>
          ) : (
            penjualanCabang.map((c, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  fontSize:       13,
                  marginBottom:   6,
                }}>
                  {/* Hilangkan prefix "Elang Anugerah " biar ringkas di bar */}
                  <span style={{ fontWeight: 600 }}>
                    {c.name.replace('Elang Anugerah ', '')}
                  </span>
                  <span style={{ color: COLOR.textSub }}>{c.value} Trx</span>
                </div>
                <div style={{
                  height:       24,
                  background:   COLOR.amberLight,
                  borderRadius: 6,
                  overflow:     'hidden',
                }}>
                  <div style={{
                    height:       '100%',
                    borderRadius: 6,
                    width:        `${(c.value / maxPenjualan) * 100}%`,
                    background:   'linear-gradient(90deg, rgba(255,165,0,0.9) 0%, rgba(255,165,0,0.1) 100%)',
                    display:      'flex',
                    alignItems:   'center',
                    paddingLeft:  10,
                    transition:   'width 0.4s',
                  }}>
                    <span style={{
                      fontSize:     11,
                      fontWeight:   700,
                      color:        '#7A4500',
                      whiteSpace:   'nowrap',
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {c.name.replace('Elang Anugerah ', '')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stok Menipis */}
        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding:      isMobile ? 16 : 24,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Stok Menipis
          </div>

          {loading ? (
            <div style={{ color: COLOR.textMuted, fontSize: 13 }}>Memuat...</div>
          ) : stokMenipis.length === 0 ? (
            <div style={{ color: COLOR.textMuted, fontSize: 13 }}>
              Semua stok dalam kondisi aman. ✓
            </div>
          ) : (
            stokMenipis.map((s, i) => (
              <div
                key={i}
                style={{
                  display:       'flex',
                  alignItems:    isMobile ? 'flex-start' : 'center',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap:           isMobile ? 6 : 0,
                  padding:       '9px 0',
                  borderBottom:  i < stokMenipis.length - 1 ? `1px solid ${COLOR.border}` : 'none',
                }}
              >
                <div style={{ flex: isMobile ? 'none' : 2, width: isMobile ? '100%' : 'auto' }}>
                  <span style={{ fontSize: 13 }}>{s.nama}</span>
                </div>
                <div style={{
                  flex:           isMobile ? 'none' : 1,
                  display:        'flex',
                  justifyContent: isMobile ? 'space-between' : 'center',
                  width:          isMobile ? '100%' : 'auto',
                }}>
                  <Badge color={s.critical ? 'red' : 'amber'}>• {s.unit} unit</Badge>
                  {isMobile && (
                    <span style={{ fontSize: 12, color: COLOR.textMuted }}>{s.cabang}</span>
                  )}
                </div>
                {!isMobile && (
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 12, color: COLOR.textMuted }}>{s.cabang}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Transaksi Terakhir ───────────────────────────────── */}
      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      isMobile ? 16 : 24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Transaksi Terakhir
        </div>

        {loading ? (
          <div style={{ color: COLOR.textMuted, fontSize: 13 }}>Memuat...</div>
        ) : transaksiTerakhir.length === 0 ? (
          <div style={{ color: COLOR.textMuted, fontSize: 13 }}>
            Belum ada transaksi hari ini.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 480 : 'auto' }}>
              <TableHeader cols={['No Transaksi', 'Waktu', 'Jumlah Item', 'Cabang', 'Total']} />
              <tbody>
                {transaksiTerakhir.map((t, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                    {[t.id, t.waktu, t.jumlah, t.cabang, t.total].map((val, j) => (
                      <td
                        key={j}
                        style={{
                          padding:    '12px 16px',
                          fontSize:   13,
                          color:      COLOR.text,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}