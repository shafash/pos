import { COLOR } from '../constants/colors'
import { laporanBulananData } from '../constants/mockData'
import { fmt } from '../utils/format'
import StatCard from '../components/ui/StatCard'
import TableHeader from '../components/ui/TableHeader'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const laporanHarianData  = Array.from({ length: 6 }, (_, i) => ({
    tanggal: `0${i +1} Jun 2026`,
    transaksi: 40 + i * 3,
    pendapatan: 1200000 + i * 100000,
    pajak: 36000 + i * 3000,
    bersih: 1164000 + i * 97000,
}))

export default function Laporan() {
    return (
        <div>
            <div style = {{
                display: 'flex',
                gap: 16,
                marginBottom: 24,
            }}>
                <StatCard label = "Total Pendapatan" value = "Rp. 45.000.000" sub = "Bulan ini" />
                <StatCard label = "Transaksi" value = "1.245" sub = "Total bulan ini" />
                <StatCard label = "Rata-rata/Hari" value = "Rp. 1.500.000" sub = "30 hari terakhir" />
            </div>

            <div style = {{
                background: COLOR.card,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
            }}>
                <div style = {{
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 16,
                }}>
                    Pendapatan Bulanan
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={laporanBulananData}>
                        <defs>
                            <linearGradient id="laporanGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={COLOR.amber} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={COLOR.amber} stopOpacity={0}   />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
                        <XAxis dataKey="bulan" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
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

            <div style = {{
                background: COLOR.card,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 12,
                overflow: 'hidden',
            }}>
                <table style = {{
                    width: '100%',
                    borderCollapse: 'collapse',
                }}>
                    <TableHeader cols = {['Tanggal', 'Total Transaksi', 'Pendapatan', 'Pajak', 'Bersih']} />
                    <tbody>
                        {laporanHarianData.map((row, i) => (
                            <tr key = {i} style = {{ borderBottom: `1px solid ${COLOR.border}`}}>
                                <td style = {{
                                    padding: '12px 16px',
                                    fontSize: 13,
                                }}>
                                    {row.tanggal}
                                </td>
                                <td style = {{
                                    padding: '12px 16px',
                                    fontSize: 13,
                                }}>
                                    {row.transaksi}
                                </td><td style = {{
                                    padding: '12px 16px',
                                    fontSize: 13,
                                }}>
                                    {fmt(row.pendapatan)}
                                </td><td style = {{
                                    padding: '12px 16px',
                                    fontSize: 13,
                                }}>
                                    {fmt(row.pajak)}
                                </td>
                                <td style = {{
                                    padding: '12px 16px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: COLOR.green,
                                }}>
                                    {fmt(row.bersih)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}