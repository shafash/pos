import { useState } from 'react'
import { UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { memberListData } from '../constants/mockData'
import StatCard from '../components/ui/StatCard'
import TableHeader from '../components/ui/TableHeader'
import SearchBar from '../components/ui/SearchBar'
import PrimaryBtn from '../components/ui/PrimaryBtn'
import ActionBtn from '../components/ui/ActionBtn'

export default function DataMember() {
    const [members] = useState(memberListData)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const filtered = members.filter(m =>
        m.nama.toLowerCase().includes(search.toLowerCase()) ||
        m.memberId.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            <div style = {{
                display: 'flex',
                gap: 16,
                marginBottom: 24,
            }}>
                <StatCard label = "Total Member" value = "450" sub = "Seluruh Database" />
                <StatCard label = "Member Aktif" value = "234" sub = "+6 Member bulan ini" />
                <StatCard label = "Poin Terbanyak" value = "8.500 Poin" sub = "An. Keizuro Isaac" />
            </div>

            <div style = {{
                display: 'flex',
                gap: 12,
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <SearchBar placeholder = "Cari nama atau ID Member..." value = {search} onChange = {e => setSearch(e.target.value)} />
                    <PrimaryBtn icon = {UserPlus} onClick = {() => onNav('tambahMember')}>Tambah Member</PrimaryBtn>
            </div>

            <div style = {{
                background: COLOR.card,
                border:`1px solid${COLOR.border}`,
                borderRadius: 12,
                overflow: 'hidden',
            }}>
                <table style = {{
                    width: '100%',
                    borderCollapse: 'collapse',
                }}>
                    <TableHeader cols = {[ 'No', 'ID Member', 'Nama', 'No.Telepon', 'Alamat', 'Poin', 'Aksi' ]} />
                    <tbody>
                        {filtered.map((m, i) => (
                            <tr key = {m.id} style = {{borderBottom: `1px solid ${COLOR.border}`}}>
                                <td style = {{
                                    padding: '14px 16px',
                                    fontSize: 13,
                                }}>
                                    {i +1}
                                </td>
                                <td style = {{
                                    padding: '14px 16px',
                                    fontSize: 13, 
                                    color: COLOR.textSub
                                }}>
                                    {m.memberId}
                                </td>
                                <td style = {{
                                    padding: '14px 16px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}>
                                    {m.nama}
                                </td>
                                <td style = {{
                                    padding: '14px 16px',
                                    fontSize: 13,
                                }}>
                                    {m.telp}
                                </td>
                                <td style = {{
                                    padding: '14px 16px',
                                    fontSize: 12,
                                    color: COLOR.textSub,
                                    maxWidth: 200,
                                }}>
                                    {m.alamat}
                                </td>
                                <td style = {{
                                    padding: '14px 16px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                }}>
                                    {m.poin.toLocaleString('id-ID')}
                                </td>
                                <td style = {{padding: '14px 16px'}}>
                                    <div style = {{
                                        display: 'flex',
                                        gap: 4,
                                    }}>
                                        <ActionBtn icon = {Pencil} onClick = {() => onNav('editMember')}/>
                                        <ActionBtn icon = {Trash2} color = {COLOR.red} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style = {{
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: `1px solid ${COLOR.border}`,
                }}>
                    <span style = {{
                        fontSize: 12,
                        color: COLOR.textMuted,
                    }}>
                        Menampilkan {filtered.length} dari 400 member
                    </span>
                    <div style = {{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }}>
                        <button onClick = {() => setPage(p => Math.max(1, p -1))} style = {{
                            width: 30,
                            height: 30,
                            border: `1px solid ${COLOR.border}`,
                            borderRadius: 6,
                            background: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <ChevronLeft size = {14} />
                        </button>
                        {[1, 2, 3].map(n => (
                            <button key = {n} onClick = {() => setPage(n)} style = {{
                                width: 30,
                                height: 30,
                                border: `1px solid ${page === n ? COLOR.amber : COLOR.border}`,
                                borderRadius: 6,
                                background: page === n ? COLOR.amber : '#fff',
                                color: page === n ? '#fff' : COLOR.text,
                                cursor: 'pointer',
                                fontWeight: page === n ? 700 : 400,
                                fontSize: 13,
                                fontFamily: 'Geist',
                            }}>
                                {n}
                            </button>
                        ))}
                        <span style = {{
                            color: COLOR.textMuted,
                            fontSize: 12,
                        }}>
                            —
                        </span>
                        <button onClick = {() => setPage(p => p + 1)} style = {{
                            width: 30,
                            height: 30,
                            border: `1px solid ${COLOR.border}`,
                            borderRadius: 6,
                            background: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <ChevronRight size = {14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}