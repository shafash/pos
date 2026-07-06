import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, Upload, Loader } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { laporanService } from '../services/api'
import { useApi } from '../hooks/useApi'
import { fmt } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import StatCard    from '../components/ui/StatCard'
import TableHeader from '../components/ui/TableHeader'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const TABLE_COLS = ['Tanggal', 'Total Transaksi', 'Pendapatan', 'Pajak (3%)', 'Bersih']

// Nama cabang sesuai seeder — dipakai untuk filter dropdown
const CABANG_LIST = [
  { id: null, nama: 'Semua Cabang'              },
  { id: 1,    nama: 'Elang Anugerah Blimbing'   },
  { id: 2,    nama: 'Elang Anugerah Kepanjen'   },
  { id: 3,    nama: 'Elang Anugerah Turen'      },
  { id: 4,    nama: 'Elang Anugerah Singosari'  },
]

// Helper: format tanggal YYYY-MM-DD ke "01 Jun 2026"
function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Helper: format bulan "2026-06" ke "Jun 2026"
function formatBulan(periodeStr) {
  if (!periodeStr) return '-'
  const [year, month] = periodeStr.split('-')
  const d = new Date(year, parseInt(month) - 1)
  return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

// Helper: singkat nama bulan saja (untuk grafik)
function singkatBulan(periodeStr) {
  if (!periodeStr) return ''
  const [year, month] = periodeStr.split('-')
  const d = new Date(year, parseInt(month) - 1)
  return d.toLocaleDateString('id-ID', { month: 'short' })
}

export default function Laporan() {
  const { user } = useAuth()

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  // ── State filter ─────────────────────────────────────────
  const now        = new Date()
  const tahunIni   = now.getFullYear()
  const bulanIni   = String(now.getMonth() + 1).padStart(2, '0')

  const [search,    setSearch]    = useState('')
  const [cabangId,  setCabangId]  = useState(user?.cabang_id ?? null)
  const [dariTgl,   setDariTgl]   = useState(`${tahunIni}-${bulanIni}-01`)
  const [sampaiTgl, setSampaiTgl] = useState(`${tahunIni}-${bulanIni}-${String(new Date(tahunIni, now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`)

  // ── Fetch laporan harian (untuk tabel) ───────────────────
  const {
    data:    laporanHarian,
    loading: loadingHarian,
    error:   errorHarian,
    execute: fetchHarian,
  } = useApi(laporanService.get)

  // ── Fetch laporan bulanan (untuk grafik) ─────────────────
  const {
    data:    laporanBulanan,
    loading: loadingBulanan,
    execute: fetchBulanan,
  } = useApi(laporanService.get)

  // Fetch keduanya saat filter berubah
  useEffect(() => {
    fetchHarian({
      tipe:      'harian',
      dari:      dariTgl,
      sampai:    sampaiTgl,
      cabang_id: cabangId ?? undefined,
    })
  }, [dariTgl, sampaiTgl, cabangId])

  useEffect(() => {
    fetchBulanan({
      tipe:      'bulanan',
      dari:      `${tahunIni}-01-01`,
      sampai:    `${tahunIni}-12-31`,
      cabang_id: cabangId ?? undefined,
    })
  }, [cabangId, tahunIni])

  // ── Transform data grafik bulanan ────────────────────────
  // API return { periode: '2026-06', total, jumlah_transaksi }
  // Recharts butuh { bulan: 'Jun', value: ... }
  const grafikData = useMemo(() => {
    const rows = laporanBulanan?.grafik ?? []
    return rows.map(r => ({
      bulan: singkatBulan(r.periode),
      value: parseFloat(r.total ?? 0),
    }))
  }, [laporanBulanan])

  // ── Transform data tabel harian ─────────────────────────
  // API return { periode: '2026-06-01', total, jumlah_transaksi }
  // Frontend tambah kolom pajak (3%) dan bersih
  const tabelData = useMemo(() => {
    const rows = laporanHarian?.grafik ?? []
    return rows.map(r => {
      const pendapatan = parseFloat(r.total ?? 0)
      const pajak      = Math.round(pendapatan * 0.03)
      const bersih     = pendapatan - pajak
      return {
        tanggal:    formatTanggal(r.periode),
        transaksi:  r.jumlah_transaksi ?? 0,
        pendapatan,
        pajak,
        bersih,
        _raw:       r.periode, // untuk filter search
      }
    })
  }, [laporanHarian])

  // Filter tabel berdasarkan search (by tanggal)
  const filteredTabel = tabelData.filter(row =>
    row.tanggal.toLowerCase().includes(search.toLowerCase())
  )

  // ── StatCard values ──────────────────────────────────────
  const totalPendapatan = parseFloat(laporanHarian?.total_omset     ?? 0)
  const totalTransaksi  = parseInt(laporanHarian?.total_transaksi   ?? 0)
  const hariDalamPeriode = tabelData.length || 1
  const rataHari        = totalPendapatan / hariDalamPeriode

  // ── Export handler ───────────────────────────────────────
  const handleExport = () => {
    // Buka tab baru ke endpoint laporan (bisa dikembangkan ke PDF nanti)
    const params = new URLSearchParams({
      tipe:   'harian',
      dari:   dariTgl,
      sampai: sampaiTgl,
      ...(cabangId ? { cabang_id: cabangId } : {}),
    })
    window.open(`http://127.0.0.1:8000/api/laporan?${params.toString()}`, '_blank')
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ paddingTop: isMobile ? 16 : 24 }}>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        {isStacked ? (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <StatCard
                label="Total Pendapatan"
                value={loadingHarian ? '...' : fmt(totalPendapatan)}
                sub="Periode dipilih"
                compact
              />
              <StatCard
                label="Transaksi"
                value={loadingHarian ? '...' : totalTransaksi.toLocaleString('id-ID')}
                sub="Total periode ini"
                compact
              />
            </div>
            <StatCard
              label="Rata-rata/Hari"
              value={loadingHarian ? '...' : fmt(rataHari)}
              sub={`${hariDalamPeriode} hari dalam periode`}
              compact
            />
          </>
        ) : (
          <div style={{ display: 'flex', gap: 16 }}>
            <StatCard
              label="Total Pendapatan"
              value={loadingHarian ? '...' : fmt(totalPendapatan)}
              sub="Periode dipilih"
            />
            <StatCard
              label="Transaksi"
              value={loadingHarian ? '...' : totalTransaksi.toLocaleString('id-ID')}
              sub="Total periode ini"
            />
            <StatCard
              label="Rata-rata/Hari"
              value={loadingHarian ? '...' : fmt(rataHari)}
              sub={`${hariDalamPeriode} hari dalam periode`}
            />
          </div>
        )}
      </div>

      {/* ── Grafik Pendapatan Bulanan ────────────────────────── */}
      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      isMobile ? 16 : 24,
        marginBottom: isMobile ? 16 : 20,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Pendapatan Bulanan {tahunIni}
        </div>

        {loadingBulanan ? (
          <div style={{ height: isMobile ? 200 : 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLOR.textMuted, fontSize: 13 }}>
            <Loader size={20} color={COLOR.amber} />
          </div>
        ) : grafikData.length === 0 ? (
          <div style={{ height: isMobile ? 200 : 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLOR.textMuted, fontSize: 13 }}>
            Belum ada data transaksi tahun ini.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
            <AreaChart
              data={grafikData}
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
                tickFormatter={v => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}JT` : v}
              />
              <Tooltip formatter={v => [fmt(v), 'Pendapatan']} />
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
        )}
      </div>

      {/* ── Tabel Laporan Harian ─────────────────────────────── */}
      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        overflow:     'hidden',
      }}>

        {/* Header tabel + filter */}
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
            flexWrap:      'wrap',
          }}>

            {/* Filter tanggal dari */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: COLOR.textMuted, whiteSpace: 'nowrap' }}>Dari</span>
              <input
                type="date"
                value={dariTgl}
                onChange={e => setDariTgl(e.target.value)}
                style={{
                  padding:      '7px 10px',
                  border:       `1px solid ${COLOR.border}`,
                  borderRadius: 8,
                  fontSize:     13,
                  fontFamily:   'inherit',
                  color:        COLOR.text,
                  background:   '#fff',
                  cursor:       'pointer',
                }}
              />
            </div>

            {/* Filter tanggal sampai */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: COLOR.textMuted, whiteSpace: 'nowrap' }}>Sampai</span>
              <input
                type="date"
                value={sampaiTgl}
                onChange={e => setSampaiTgl(e.target.value)}
                style={{
                  padding:      '7px 10px',
                  border:       `1px solid ${COLOR.border}`,
                  borderRadius: 8,
                  fontSize:     13,
                  fontFamily:   'inherit',
                  color:        COLOR.text,
                  background:   '#fff',
                  cursor:       'pointer',
                }}
              />
            </div>

            {/* Search tanggal */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              padding:      '8px 12px',
              border:       `1px solid ${COLOR.border}`,
              borderRadius: 8,
              background:   '#fff',
              flex:         isMobile ? undefined : '1 1 160px',
              minWidth:     0,
            }}>
              <Search size={14} color={COLOR.textMuted} style={{ flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari tanggal..."
                style={{
                  border:     'none',
                  outline:    'none',
                  fontSize:   13,
                  fontFamily: 'inherit',
                  width:      '100%',
                  color:      COLOR.text,
                  background: 'transparent',
                }}
              />
            </div>

            {/* Filter cabang */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <select
                value={cabangId ?? ''}
                onChange={e => setCabangId(e.target.value ? parseInt(e.target.value) : null)}
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
                {CABANG_LIST.map(c => (
                  <option key={c.id ?? 'all'} value={c.id ?? ''}>
                    {c.nama}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                color={COLOR.textMuted}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>

            {/* Export */}
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

        {/* Loading */}
        {loadingHarian && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
            <Loader size={20} color={COLOR.amber} />
            <div style={{ marginTop: 8 }}>Memuat laporan...</div>
          </div>
        )}

        {/* Error */}
        {errorHarian && !loadingHarian && (
          <div style={{ padding: '24px 20px', color: '#DC2626', fontSize: 13 }}>
            Gagal memuat laporan: {errorHarian}
          </div>
        )}

        {/* Tabel */}
        {!loadingHarian && !errorHarian && (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isStacked ? 640 : 'auto' }}>
              <TableHeader cols={TABLE_COLS} />
              <tbody>
                {filteredTabel.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
                      Tidak ada data laporan untuk periode ini.
                    </td>
                  </tr>
                ) : (
                  filteredTabel.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        {row.tanggal}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        {row.transaksi}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        {fmt(row.pendapatan)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap', color: COLOR.textMuted }}>
                        {fmt(row.pajak)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: COLOR.accent, whiteSpace: 'nowrap' }}>
                        {fmt(row.bersih)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer total */}
        {!loadingHarian && filteredTabel.length > 0 && (
          <div style={{
            padding:        '12px 16px',
            borderTop:      `1px solid ${COLOR.border}`,
            display:        'flex',
            justifyContent: 'flex-end',
            gap:            32,
            fontSize:       13,
            fontWeight:     700,
          }}>
            <span style={{ color: COLOR.textSub }}>
              Total: {filteredTabel.reduce((s, r) => s + r.transaksi, 0)} transaksi
            </span>
            <span style={{ color: COLOR.accent }}>
              Bersih: {fmt(filteredTabel.reduce((s, r) => s + r.bersih, 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}