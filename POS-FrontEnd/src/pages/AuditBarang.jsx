import { useMemo, useState, useEffect, useCallback } from 'react'
import { Search, CheckCircle, AlertTriangle, X, Loader } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useIsMobile } from '../hooks/useIsMobile'
import { auditService, produkService } from '../services/api'
import { useApi, useMutation } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'

const quickAdds = [1, 5, 10]
const font = "'Geist', sans-serif"

// ─────────────────────────────────────────────────────────────
// Helper: hitung selisih dan label untuk Session Activity
// ─────────────────────────────────────────────────────────────
function detailLabel(detail) {
  if (detail.selisih === 0) return { text: `Count: ${detail.stok_fisik} (Match)`, isMatch: true }
  return { text: `Diff: ${detail.selisih > 0 ? '+' : ''}${detail.selisih} Unit`, isMatch: false }
}

export default function AuditBarang() {
  const { user } = useAuth()
  const cabangId = user?.cabang_id ?? 1

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet
  const imgSize     = isMobile ? 88 : 149

  // ── State utama ──────────────────────────────────────────
  const [sesiAudit,    setSesiAudit]    = useState(null)   // object sesi audit aktif
  const [produkAktif,  setProdukAktif]  = useState(null)   // produk yang sedang dihitung
  const [actualCount,  setActualCount]  = useState(0)
  const [searchValue,  setSearchValue]  = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sessionItems, setSessionItems] = useState([])     // detail audit yang sudah disubmit
  const [totalProduk,  setTotalProduk]  = useState(0)

  // ── State modal konfirmasi (Finish & Discard) ────────────
  const [konfirmFinish,  setKonfirmFinish]  = useState(false)
  const [konfirmDiscard, setKonfirmDiscard] = useState(false)

  // ── API hooks ────────────────────────────────────────────
  const { data: auditList,  loading: loadingCekSesi, execute: cekSesi     } = useApi(auditService.getAll)
  const { data: produkList, loading: loadingProduk,  execute: fetchProduk } = useApi(produkService.getAll)
  const { loading: loadingBuatSesi, execute: buatSesi    } = useMutation(auditService.create)
  const { loading: loadingConfirm,  execute: submitDetail } = useMutation(auditService.submitDetail)
  const { loading: loadingFinish,   execute: finishAudit  } = useMutation(auditService.selesai)
  const { loading: loadingDiscard,  execute: discardAudit } = useMutation(auditService.batal)

  // ── 1. Cek sesi audit berlangsung saat halaman dibuka ───
  useEffect(() => {
    cekSesi({ cabang_id: cabangId, status: 'berlangsung' })
  }, [cabangId])

  // Setelah cek, set sesi aktif kalau ada
  useEffect(() => {
    if (!auditList) return
    const sesiAktif = auditList.find(a => a.status === 'berlangsung')
    if (sesiAktif) {
      setSesiAudit(sesiAktif)
      setSessionItems(sesiAktif.detail_audit ?? [])
    }
  }, [auditList])

  // ── 2. Fetch produk di cabang untuk search & progress ───
  useEffect(() => {
    fetchProduk({ cabang_id: cabangId }).then(data => {
      if (data) setTotalProduk(data.length)
    })
  }, [cabangId])

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchValue), 400)
    return () => clearTimeout(t)
  }, [searchValue])

  // Fetch produk dengan filter search
  useEffect(() => {
    fetchProduk({ cabang_id: cabangId, search: debouncedSearch || undefined })
  }, [debouncedSearch, cabangId])

  // ── 3. Buat sesi audit baru ──────────────────────────────
  const handleBuatSesi = async () => {
    try {
      const result = await buatSesi({ cabang_id: cabangId })
      setSesiAudit(result)
      setSessionItems([])
    } catch (err) {
      alert(err.response?.data?.message ?? 'Gagal membuat sesi audit.')
    }
  }

  // ── 4. Pilih produk untuk dihitung ──────────────────────
  const handlePilihProduk = (produk) => {
    setProdukAktif(produk)
    // Kalau produk ini sudah pernah diaudit di sesi ini, prefill dari data sebelumnya
    const existingDetail = sessionItems.find(d => d.sku === produk.sku)
    setActualCount(existingDetail?.stok_fisik ?? produk.stok_saat_ini ?? 0)
  }

  // ── 5. Submit stok fisik (Confirm Items Count) ───────────
  const handleConfirm = async () => {
    if (!sesiAudit || !produkAktif) return
    try {
      const result = await submitDetail(sesiAudit.id, [{
        sku:        produkAktif.sku,
        stok_fisik: actualCount,
        alasan:     null,
      }])

      // Update session items dari response
      const updatedDetail = result?.detail_audit ?? []
      setSessionItems(updatedDetail)
      setProdukAktif(null)
      setSearchValue('')
    } catch (err) {
      alert(err.response?.data?.message ?? 'Gagal menyimpan hasil hitungan.')
    }
  }

  // ── 6. Cancel pilih produk ──────────────────────────────
  const handleCancelPilih = () => {
    setProdukAktif(null)
    setActualCount(0)
  }

  // ── 7. Finish & Sync (dipicu setelah konfirmasi modal) ───
  const handleFinish = async () => {
    if (!sesiAudit) return
    try {
      await finishAudit(sesiAudit.id)
      setSesiAudit(null)
      setSessionItems([])
      setProdukAktif(null)
      setKonfirmFinish(false)
      alert('Audit selesai! Stok sistem telah diperbarui.')
    } catch (err) {
      setKonfirmFinish(false)
      alert(err.response?.data?.message ?? 'Gagal menyelesaikan audit.')
    }
  }

  // ── 8. Discard Session (dipicu setelah konfirmasi modal) ─
  const handleDiscard = async () => {
    if (!sesiAudit) return
    try {
      await discardAudit(sesiAudit.id)
      setSesiAudit(null)
      setSessionItems([])
      setProdukAktif(null)
      setKonfirmDiscard(false)
    } catch (err) {
      setKonfirmDiscard(false)
      alert(err.response?.data?.message ?? 'Gagal membatalkan sesi audit.')
    }
  }

  // ── Derived values ──────────────────────────────────────
  const systemStock     = produkAktif?.stok_saat_ini ?? 0
  const diff            = actualCount - systemStock
  const progressCurrent = sessionItems.length
  const progressPercent = totalProduk > 0
    ? Math.round((progressCurrent / totalProduk) * 100)
    : 0
  const progressWidth = `${progressPercent}%`

  // Produk yang tampil di search result (exclude yang sudah diaudit bisa juga)
  const produkTampil = produkList ?? []

  // ── Modal konfirmasi Finish & Sync ───────────────────────
  const modalFinish = konfirmFinish && (
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
        fontFamily:   font,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Selesaikan Audit?</div>
        <div style={{ fontSize: 13, color: COLOR.textSub, marginBottom: 20, lineHeight: 1.6 }}>
          Stok sistem akan disinkronkan dengan hasil hitungan fisik untuk{' '}
          <strong>{sessionItems.length} produk</strong>. Tindakan ini tidak dapat dibatalkan.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setKonfirmFinish(false)}
            disabled={loadingFinish}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: `1px solid ${COLOR.border}`, background: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleFinish}
            disabled={loadingFinish}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: 'none', background: COLOR.amber, color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: loadingFinish ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}
          >
            {loadingFinish && <Loader size={14} color="#fff" />}
            {loadingFinish ? 'Menyimpan...' : 'Ya, Selesaikan'}
          </button>
        </div>
      </div>
    </div>
  )

  // ── Modal konfirmasi Discard Session ─────────────────────
  const modalDiscard = konfirmDiscard && (
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
        fontFamily:   font,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Batalkan Sesi Audit?</div>
        <div style={{ fontSize: 13, color: COLOR.textSub, marginBottom: 20, lineHeight: 1.6 }}>
          Semua hasil hitungan di sesi ini akan diabaikan dan tidak tersimpan.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setKonfirmDiscard(false)}
            disabled={loadingDiscard}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: `1px solid ${COLOR.border}`, background: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleDiscard}
            disabled={loadingDiscard}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: 'none', background: COLOR.red, color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: loadingDiscard ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}
          >
            {loadingDiscard && <Loader size={14} color="#fff" />}
            {loadingDiscard ? 'Membatalkan...' : 'Ya, Batalkan'}
          </button>
        </div>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────
  // Kalau belum ada sesi audit aktif → tampilkan tombol mulai
  // ─────────────────────────────────────────────────────────
  if (loadingCekSesi) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: COLOR.textMuted, fontFamily: font, marginTop: isMobile ? 16 : 24 }}>
        <Loader size={24} color={COLOR.amber} />
        <div style={{ marginTop: 12, fontSize: 13 }}>Memeriksa sesi audit...</div>
      </div>
    )
  }

  if (!sesiAudit) {
    return (
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '60px 20px',
        gap:            16,
        fontFamily:     font,
        textAlign:      'center',
        marginTop:      isMobile ? 16 : 24,
      }}>
        <div style={{
          width:          72, height: 72,
          background:     '#4A3500',
          borderRadius:   '50%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}>
          <CheckCircle size={32} color="#FFD700" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Mulai Sesi Audit Stok</div>
          <div style={{ fontSize: 13, color: COLOR.textSub, lineHeight: 1.6, maxWidth: 340 }}>
            Belum ada sesi audit aktif untuk cabang ini. Mulai sesi baru untuk menghitung stok fisik dan sinkronkan dengan data sistem.
          </div>
        </div>
        <button
          onClick={handleBuatSesi}
          disabled={loadingBuatSesi}
          style={{
            background:   COLOR.amber,
            color:        '#fff',
            border:       'none',
            borderRadius: 10,
            padding:      '14px 32px',
            fontWeight:   700,
            fontSize:     14,
            cursor:       loadingBuatSesi ? 'not-allowed' : 'pointer',
            fontFamily:   font,
            display:      'flex',
            alignItems:   'center',
            gap:          8,
          }}
        >
          {loadingBuatSesi && <Loader size={16} color="#fff" />}
          {loadingBuatSesi ? 'Membuat Sesi...' : 'Mulai Audit Sekarang'}
        </button>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // Sesi aktif → tampilkan UI audit
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{
      display:       'flex',
      flexDirection: isStacked ? 'column' : 'row',
      gap:           isMobile ? 16 : 20,
      alignItems:    isStacked ? 'stretch' : 'flex-start',
      fontFamily:    font,
      paddingTop:    isMobile ? 16 : 24,
    }}>
      {modalFinish}
      {modalDiscard}

      {/* ── Panel kiri: search + active audit ── */}
      <div style={{ flex: isStacked ? undefined : 2, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

        {/* Search bar */}
        <div style={{
          background:   '#fff',
          borderRadius: 8,
          border:       `1px solid ${COLOR.border}`,
          padding:      isMobile ? '12px 14px' : '16px 20px',
          display:      'flex',
          alignItems:   'center',
          gap:          12,
        }}>
          <Search size={18} color={COLOR.textMuted} style={{ flexShrink: 0 }} />
          <input
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Cari nama produk atau SKU..."
            style={{
              flex:         1,
              minWidth:     0,
              background:   '#F4F5F7',
              border:       'none',
              outline:      'none',
              borderRadius: 10,
              padding:      '10px 16px',
              fontSize:     13,
              color:        COLOR.text,
              fontFamily:   font,
            }}
          />
          {loadingProduk && <Loader size={16} color={COLOR.amber} style={{ flexShrink: 0 }} />}
        </div>

        {/* Dropdown hasil search — muncul kalau ada keyword dan produk aktif belum dipilih */}
        {searchValue && !produkAktif && (
          <div style={{
            background:   '#fff',
            borderRadius: 8,
            border:       `1px solid ${COLOR.border}`,
            overflow:     'hidden',
            maxHeight:    280,
            overflowY:    'auto',
          }}>
            {produkTampil.length === 0 ? (
              <div style={{ padding: '20px 16px', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
                Produk tidak ditemukan.
              </div>
            ) : (
              produkTampil.map((p, i) => {
                const sudahDiaudit = sessionItems.some(d => d.sku === p.sku)
                return (
                  <div
                    key={p.sku}
                    onClick={() => handlePilihProduk(p)}
                    style={{
                      display:      'flex',
                      alignItems:   'center',
                      gap:          12,
                      padding:      '12px 16px',
                      borderBottom: i < produkTampil.length - 1 ? `1px solid ${COLOR.border}` : 'none',
                      cursor:       'pointer',
                      background:   sudahDiaudit ? '#F9FFF9' : '#fff',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLOR.amberLight}
                    onMouseLeave={e => e.currentTarget.style.background = sudahDiaudit ? '#F9FFF9' : '#fff'}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.nama_barang}</div>
                      <div style={{ fontSize: 11, color: COLOR.textMuted }}>{p.sku} · Stok sistem: {p.stok_saat_ini}</div>
                    </div>
                    {sudahDiaudit && (
                      <CheckCircle size={16} color="#22C55E" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Active Audit Panel */}
        <div style={{
          background:   '#fff',
          borderRadius: 8,
          border:       `1px solid ${COLOR.border}`,
          overflow:     'hidden',
        }}>
          <div style={{
            background: '#FFCD71',
            padding:    isMobile ? '12px 16px' : '14px 20px',
            fontWeight: 600,
            fontSize:   14,
            color:      '#000',
            fontFamily: font,
            display:    'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>ACTIVE AUDIT SISTEM</span>
            <span style={{ fontSize: 12, fontWeight: 400 }}>
              Sesi #{sesiAudit.id}
            </span>
          </div>

          <div style={{ padding: isMobile ? '16px 14px' : '24px 20px' }}>
            {!produkAktif ? (
              // Belum pilih produk
              <div style={{
                textAlign:  'center',
                padding:    '32px 0',
                color:      COLOR.textMuted,
                fontSize:   13,
                fontFamily: font,
              }}>
                <Search size={32} color={COLOR.border} style={{ marginBottom: 12 }} />
                <div>Cari dan pilih produk di atas untuk mulai menghitung.</div>
              </div>
            ) : (
              // Produk aktif — UI hitung stok
              <div style={{ display: 'flex', gap: isMobile ? 12 : 24 }}>

                {/* Foto + nama produk */}
                <div style={{
                  display:       'flex',
                  flexDirection: 'column',
                  alignItems:    'flex-start',
                  gap:           12,
                  flexShrink:    0,
                }}>
                  <div style={{
                    width:          imgSize,
                    height:         imgSize,
                    background:     '#1A3A0A',
                    borderRadius:   8,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#FFD700', fontWeight: 900, fontSize: isMobile ? 18 : 28, fontFamily: font }}>
                      {(produkAktif.merek ?? produkAktif.nama_barang).substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 15, color: '#000', fontFamily: font }}>
                      {produkAktif.merek ?? '-'}
                    </div>
                    <div style={{ fontSize: isMobile ? 11 : 12, color: COLOR.textMuted, marginTop: 3, fontFamily: font }}>
                      {produkAktif.nama_barang}
                    </div>
                    <div style={{ fontSize: 10, color: COLOR.textMuted, marginTop: 2, fontFamily: font }}>
                      {produkAktif.sku}
                    </div>
                  </div>
                </div>

                {/* Input count */}
                <div style={{ flex: 1, minWidth: 0 }}>

                  {/* System Stock vs Actual Count */}
                  <div style={{ display: 'flex', gap: isMobile ? 8 : 14, marginBottom: isMobile ? 14 : 20 }}>
                    <div style={{
                      flex:         1, minWidth: 0,
                      background:   '#fff',
                      border:       `1px solid ${COLOR.border}`,
                      borderRadius: 8,
                      padding:      isMobile ? '8px 10px' : '10px 14px',
                    }}>
                      <div style={{ fontSize: isMobile ? 10 : 11, color: COLOR.textMuted, marginBottom: isMobile ? 4 : 8, fontFamily: font }}>
                        System Stock
                      </div>
                      <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 500, color: '#000', fontFamily: font }}>
                        {systemStock}
                      </div>
                    </div>

                    <div style={{
                      flex:         1, minWidth: 0,
                      background:   '#fff',
                      border:       '1.5px solid #FFCD71',
                      borderRadius: 8,
                      padding:      isMobile ? '8px 10px' : '10px 14px',
                    }}>
                      <div style={{ fontSize: isMobile ? 10 : 11, color: '#734A00', marginBottom: isMobile ? 4 : 8, fontFamily: font }}>
                        Actual Count
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="number"
                          min={0}
                          value={actualCount}
                          onChange={e => setActualCount(Math.max(0, parseInt(e.target.value) || 0))}
                          style={{
                            width:      isMobile ? 52 : 64,
                            fontSize:   isMobile ? 20 : 28,
                            fontWeight: 500,
                            color:      '#000',
                            fontFamily: font,
                            border:     'none',
                            outline:    'none',
                            background: 'transparent',
                            padding:    0,
                          }}
                        />
                        <span style={{ fontSize: isMobile ? 13 : 18, fontWeight: 500, color: diff === 0 ? '#22C55E' : '#B01212', fontFamily: font }}>
                          {diff === 0 ? '✓' : (diff > 0 ? `+${diff}` : diff)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick physical count */}
                  <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: '#000', marginBottom: 10, fontFamily: font }}>
                    QUICK PHYSICAL COUNT
                  </div>
                  <div style={{ display: 'flex', gap: isMobile ? 8 : 12, marginBottom: 16 }}>
                    {quickAdds.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setActualCount(prev => prev + amount)}
                        style={{
                          flex:         1,
                          height:       isMobile ? 52 : 71,
                          background:   '#fff',
                          border:       `1px solid ${COLOR.border}`,
                          borderRadius: 8,
                          fontSize:     isMobile ? 15 : 20,
                          fontWeight:   500,
                          cursor:       'pointer',
                          fontFamily:   font,
                          color:        '#000',
                        }}
                      >
                        +{amount}
                      </button>
                    ))}
                  </div>

                  {/* Confirm + Cancel */}
                  <div style={{ display: 'flex', gap: isMobile ? 8 : 12 }}>
                    <button
                      onClick={handleConfirm}
                      disabled={loadingConfirm}
                      style={{
                        flex:         1,
                        height:       41,
                        background:   '#FFA500',
                        border:       'none',
                        borderRadius: 8,
                        fontSize:     isMobile ? 12 : 14,
                        fontWeight:   500,
                        color:        '#fff',
                        cursor:       loadingConfirm ? 'not-allowed' : 'pointer',
                        fontFamily:   font,
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent: 'center',
                        gap:          6,
                      }}
                    >
                      {loadingConfirm && <Loader size={14} color="#fff" />}
                      {loadingConfirm ? 'Menyimpan...' : 'Confirm Items Count'}
                    </button>
                    <button
                      onClick={handleCancelPilih}
                      style={{
                        width:          isMobile ? 44 : 52,
                        height:         41,
                        background:     '#fff',
                        border:         `1px solid ${COLOR.border}`,
                        borderRadius:   8,
                        cursor:         'pointer',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        flexShrink:     0,
                      }}
                    >
                      <X size={15} color={COLOR.textMuted} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Panel kanan: session activity + progress ── */}
      <div style={{
        width:         isStacked ? '100%' : 320,
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        gap:           16,
      }}>

        {/* Session Activity */}
        <div style={{
          background:   '#fff',
          borderRadius: 8,
          border:       `1px solid ${COLOR.border}`,
          overflow:     'hidden',
        }}>
          <div style={{
            padding:        isMobile ? '14px 16px' : '16px 20px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            borderBottom:   `1px solid ${COLOR.border}`,
          }}>
            <span style={{ fontWeight: 600, fontSize: 14, fontFamily: font }}>Session Activity</span>
            <div style={{
              background:   '#F4F5F7',
              borderRadius: 8,
              padding:      '4px 12px',
              fontSize:     11,
              fontWeight:   500,
              color:        COLOR.textMuted,
              fontFamily:   font,
            }}>
              {sessionItems.length} Items
            </div>
          </div>

          {sessionItems.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: COLOR.textMuted, fontSize: 13, fontFamily: font }}>
              Belum ada produk yang dihitung.
            </div>
          ) : (
            // Tampilkan 5 terakhir biar tidak terlalu panjang
            [...sessionItems].reverse().slice(0, 5).map((item, i, arr) => {
              const { text, isMatch } = detailLabel(item)
              return (
                <div key={item.sku ?? i} style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                  padding:      isMobile ? '12px 16px' : '14px 20px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${COLOR.border}` : 'none',
                }}>
                  <div style={{
                    width:          44, height: 44,
                    background:     '#FBFBFB',
                    borderRadius:   8,
                    flexShrink:     0,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}>
                    {isMatch
                      ? <CheckCircle size={20} color="#CCCCCC" strokeWidth={1.5} />
                      : <AlertTriangle size={18} color="#FF8D28" strokeWidth={1.5} />
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: '#000', fontFamily: font, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.produk?.nama_barang ?? item.sku}
                    </div>
                    <div style={{ fontSize: 11, color: isMatch ? COLOR.textMuted : '#B01212', marginTop: 3, fontFamily: font }}>
                      {text}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Progress */}
        <div style={{
          background:   '#734A00',
          borderRadius: 8,
          padding:      isMobile ? '16px 16px' : '18px 20px',
          color:        '#fff',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 14, letterSpacing: 1, fontFamily: font }}>
            PROGRESS THIS SESSION
          </div>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'flex-end',
            marginBottom:   14,
          }}>
            <span style={{ fontSize: isMobile ? 32 : 38, fontWeight: 700, lineHeight: 1, fontFamily: font }}>
              {progressPercent}%
            </span>
            <span style={{ fontSize: 11, color: '#fff', fontFamily: font }}>
              {progressCurrent}/{totalProduk} Items
            </span>
          </div>
          <div style={{ height: 8, background: '#FFF7E8', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: progressWidth, background: '#FFA500', borderRadius: 8, transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Discard + Finish */}
        <div style={{ display: 'flex', gap: 10, justifyContent: isStacked ? undefined : 'flex-end' }}>
          <button
            onClick={() => setKonfirmDiscard(true)}
            disabled={loadingDiscard}
            style={{
              flex:         isStacked ? 1 : undefined,
              padding:      isMobile ? '10px 12px' : '12px 16px',
              background:   '#F4F5F7',
              border:       'none',
              borderRadius: 8,
              fontSize:     isMobile ? 12 : 13,
              fontWeight:   600,
              color:        loadingDiscard ? COLOR.textMuted : '#DC2626',
              cursor:       loadingDiscard ? 'not-allowed' : 'pointer',
              fontFamily:   font,
              whiteSpace:   'nowrap',
              display:      'flex',
              alignItems:   'center',
              gap:          6,
            }}
          >
            {loadingDiscard && <Loader size={13} color={COLOR.textMuted} />}
            Discard Session
          </button>
          <button
            onClick={() => setKonfirmFinish(true)}
            disabled={loadingFinish || sessionItems.length === 0}
            style={{
              flex:           isStacked ? 1 : undefined,
              padding:        isMobile ? '10px 12px' : '12px 16px',
              background:     sessionItems.length === 0 ? COLOR.border : '#FFA500',
              border:         'none',
              borderRadius:   8,
              fontSize:       isMobile ? 12 : 13,
              fontWeight:     500,
              color:          sessionItems.length === 0 ? COLOR.textMuted : '#fff',
              cursor:         loadingFinish || sessionItems.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily:     font,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            8,
              whiteSpace:     'nowrap',
            }}
          >
            {loadingFinish ? <Loader size={16} color="#fff" /> : <CheckCircle size={16} />}
            {isMobile ? 'Finish & Sync' : 'Finish & Sync Audit'}
          </button>
        </div>
      </div>
    </div>
  )
}