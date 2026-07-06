import { useState, useEffect, useCallback } from 'react'
import { UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { memberService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'
import StatCard    from '../components/ui/StatCard'
import TableHeader from '../components/ui/TableHeader'
import SearchBar   from '../components/ui/SearchBar'
import PrimaryBtn  from '../components/ui/PrimaryBtn'
import ActionBtn   from '../components/ui/ActionBtn'
import { useIsMobile } from '../hooks/useIsMobile'

const PER_PAGE = 10

export default function DataMember({ onNav }) {
  const [search,       setSearch]       = useState('')
  const [page,         setPage]         = useState(1)
  const [konfirmHapus, setKonfirmHapus] = useState(null) // object member yang mau dinonaktifkan
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  // ── Fetch member dari API ────────────────────────────────
  const { data: memberList, loading, error, execute: fetchMember } = useApi(memberService.getAll)
  const { loading: loadingHapus, execute: nonaktifMember } = useMutation(memberService.deactivate)

  // Debounce search 400ms biar tidak spam request tiap ketik
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // reset ke halaman 1 saat search berubah
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch ulang kalau search atau page berubah
  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    fetchMember(params)
  }, [debouncedSearch])

  // ── Derived data ─────────────────────────────────────────
  const semuaMember = memberList ?? []

  // Pagination di frontend (semua data sudah ada, tinggal slice)
  const totalFiltered = semuaMember.length
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / PER_PAGE))
  const currentPage   = Math.min(page, totalPages)
  const paginatedData = semuaMember.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  // StatCard values dihitung dari data API
  const totalMember  = semuaMember.length
  const memberAktif  = semuaMember.filter(m => m.status === 'aktif').length
  const topMember    = semuaMember.reduce(
    (top, m) => (!top || m.poin > top.poin ? m : top),
    null
  )

  // Nomor halaman yang ditampilkan di paginator (maks 3 angka sekaligus)
  const pageNumbers = (() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage === 1) return [1, 2, 3]
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 1, currentPage, currentPage + 1]
  })()

  // ── Handler nonaktifkan member ───────────────────────────
  const handleNonaktif = async (idMember) => {
    try {
      await nonaktifMember(idMember)
      setKonfirmHapus(null)
      // Refresh list
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      fetchMember(params)
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Gagal menonaktifkan member.'
      alert(msg)
      setKonfirmHapus(null)
    }
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ paddingTop: isMobile ? 16 : 24 }}>

      {/* Modal konfirmasi nonaktifkan */}
      {konfirmHapus && (
        <div style={{
          position:       'fixed',
          inset:          0,
          background:     'rgba(0,0,0,0.4)',
          zIndex:         50,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        16,
        }}>
          <div style={{
            background:   '#fff',
            borderRadius: 12,
            padding:      24,
            maxWidth:     360,
            width:        '100%',
            boxShadow:    '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
              Nonaktifkan Member?
            </div>
            <div style={{ fontSize: 13, color: COLOR.textSub, marginBottom: 20, lineHeight: 1.6 }}>
              Member <strong>{konfirmHapus.nama_member}</strong> ({konfirmHapus.id_member}) akan
              dinonaktifkan. Riwayat transaksinya tetap tersimpan dan bisa diaktifkan kembali nanti.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setKonfirmHapus(null)}
                disabled={loadingHapus}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  border: `1px solid ${COLOR.border}`, background: '#fff',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Batal
              </button>
              <button
                onClick={() => handleNonaktif(konfirmHapus.id_member)}
                disabled={loadingHapus}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  border: 'none', background: COLOR.red, color: '#fff',
                  fontSize: 13, fontWeight: 700,
                  cursor: loadingHapus ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {loadingHapus && <Loader size={14} color="#fff" />}
                {loadingHapus ? 'Memproses...' : 'Ya, Nonaktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        {isStacked ? (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <StatCard
                label="Total Member"
                value={loading ? '...' : String(totalMember)}
                sub="Seluruh Database"
                compact
              />
              <StatCard
                label="Member Aktif"
                value={loading ? '...' : String(memberAktif)}
                sub="Status aktif"
                compact
              />
            </div>
            <StatCard
              label="Poin Terbanyak"
              value={loading || !topMember ? '...' : `${topMember.poin.toLocaleString('id-ID')} Poin`}
              sub={topMember ? `An. ${topMember.nama_member}` : '-'}
              compact
            />
          </>
        ) : (
          <div style={{ display: 'flex', gap: 16 }}>
            <StatCard
              label="Total Member"
              value={loading ? '...' : String(totalMember)}
              sub="Seluruh Database"
            />
            <StatCard
              label="Member Aktif"
              value={loading ? '...' : String(memberAktif)}
              sub="Status aktif"
            />
            <StatCard
              label="Poin Terbanyak"
              value={loading || !topMember ? '...' : `${topMember.poin.toLocaleString('id-ID')} Poin`}
              sub={topMember ? `An. ${topMember.nama_member}` : '-'}
            />
          </div>
        )}
      </div>

      {/* ── Search + Tambah ─────────────────────────────────── */}
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
            placeholder="Cari nama, ID Member, atau no. HP..."
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

      {/* ── Tabel ───────────────────────────────────────────── */}
      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        overflow:     'hidden',
      }}>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
            <Loader size={20} color={COLOR.amber} />
            <div style={{ marginTop: 8 }}>Memuat data member...</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ padding: '24px 20px', color: '#DC2626', fontSize: 13 }}>
            Gagal memuat member: {error}
            <button
              onClick={() => fetchMember({})}
              style={{ marginLeft: 12, color: COLOR.amber, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Tabel data */}
        {!loading && !error && (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isStacked ? 720 : 'auto' }}>
              <TableHeader cols={['No', 'ID Member', 'Nama', 'No.Telepon', 'Alamat', 'Poin', 'Aksi']} />
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
                      {search ? `Member "${search}" tidak ditemukan.` : 'Belum ada data member.'}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((m, i) => (
                    <tr key={m.id_member} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                      <td style={{ padding: '14px 16px', fontSize: 13 }}>
                        {(currentPage - 1) * PER_PAGE + i + 1}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: COLOR.textSub, whiteSpace: 'nowrap' }}>
                        {m.id_member}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600 }}>{m.nama_member}</div>
                        <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 2 }}>
                          {m.tier_loyalty} · {m.status === 'nonaktif' ? (
                            <span style={{ color: COLOR.red }}>Nonaktif</span>
                          ) : (
                            <span style={{ color: '#22C55E' }}>Aktif</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        {m.no_telepon}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: COLOR.textSub, maxWidth: 200 }}>
                        {m.alamat ?? '-'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {(m.poin ?? 0).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <ActionBtn
                            icon={Pencil}
                            onClick={() => onNav('editMember', { id_member: m.id_member })}
                          />
                          <ActionBtn
                            icon={Trash2}
                            color={COLOR.red}
                            onClick={() => setKonfirmHapus(m)}
                            disabled={m.status === 'nonaktif'}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────── */}
        {!loading && !error && totalFiltered > 0 && (
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
                Menampilkan {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, totalFiltered)} dari {totalFiltered} member
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 30, height: 30,
                  border: `1px solid ${COLOR.border}`,
                  borderRadius: 6, background: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={14} />
              </button>

              {pageNumbers.map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    width: 30, height: 30,
                    border: `1px solid ${currentPage === n ? COLOR.amber : COLOR.border}`,
                    borderRadius: 6,
                    background: currentPage === n ? COLOR.amber : '#fff',
                    color: currentPage === n ? '#fff' : COLOR.text,
                    cursor: 'pointer',
                    fontWeight: currentPage === n ? 700 : 400,
                    fontSize: 13, fontFamily: 'Geist', flexShrink: 0,
                  }}
                >
                  {n}
                </button>
              ))}

              {totalPages > 3 && currentPage < totalPages - 1 && (
                <span style={{ color: COLOR.textMuted, fontSize: 12 }}>—</span>
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  width: 30, height: 30,
                  border: `1px solid ${COLOR.border}`,
                  borderRadius: 6, background: '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, opacity: currentPage === totalPages ? 0.4 : 1,
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}