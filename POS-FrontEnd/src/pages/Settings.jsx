import { useState, useEffect } from 'react'
import {
  Store, Package, CreditCard, Users, Shield,
  Bell, Clock, Save, History, MoreVertical, Loader,
} from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useAuth } from '../context/AuthContext'
import { transaksiService } from '../services/api'
import { useApi } from '../hooks/useApi'
import PrimaryBtn from '../components/ui/PrimaryBtn'

// ── Breakpoint hook ────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return { isMobile: width < 640, isTablet: width < 1024 }
}

// ── localStorage helpers ───────────────────────────────────
const LS_KEY = 'pos_settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSettings(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {}
}

// ── Default settings ───────────────────────────────────────
const DEFAULT_SETTINGS = {
  toggles: {
    negativeStock: true,
    skuAuto:       true,
    barcode:       true,
    autoprint:     false,
    pointSystem:   true,
    twofa:         false,
  },
  inventory: {
    lowStockThreshold: 5,
  },
  transaction: {
    taxPercent:    3,
    invoicePrefix: 'TRX-',
  },
  loyalty: {
    pointPer1000: 10,
  },
  alerts: {
    lowStock:     true,
    dailySummary: true,
    auditMismatch:true,
    failedTrx:    false,
  },
}

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────
function Toggle({ value, onToggle, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      style={{
        width: 36, height: 20, borderRadius: 20,
        background: value ? COLOR.amber : '#E5E7EB',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: '0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        left: value ? 18 : 2,
        transition: '0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 600 }}>
      <Icon size={18} color={COLOR.amber} />
      <span style={{ color: COLOR.text, fontSize: 15 }}>{title}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Settings
// ─────────────────────────────────────────────────────────
export default function Settings() {
  const { isMobile, isTablet } = useBreakpoint()
  const { user } = useAuth()

  // ── Role check: admin bisa edit semua, kasir cuma lihat ──
  // NOTE: ini baru pembatasan di sisi tampilan (frontend). Backend
  // (Laravel) juga HARUS validasi role di setiap endpoint terkait,
  // karena request API tetap bisa dipanggil langsung tanpa lewat UI ini.
  const isAdmin = user?.role === 'admin'

  // ── Load settings dari localStorage ─────────────────────
  const [settings, setSettings] = useState(() => {
    const saved = loadSettings()
    return saved ?? DEFAULT_SETTINGS
  })
  const [saveMsg, setSaveMsg] = useState(null)

  // ── Store info dari user yang login ──────────────────────
  const cabangNama  = user?.cabang  ?? '-'
  const userNama    = user?.nama_lengkap ?? '-'
  const userRole    = user?.role ?? '-'
  const userEmail   = user?.email ?? '-'

  // ── Fetch activity log (transaksi terakhir sebagai proxy) ─
  const {
    data:    transaksiList,
    loading: loadingLog,
    execute: fetchLog,
  } = useApi(transaksiService.getAll)

  useEffect(() => {
    fetchLog({ limit: 5, ...(user?.cabang_id ? { cabang_id: user.cabang_id } : {}) })
  }, [user?.cabang_id])

  // ── Helper update nested settings (hanya admin) ──────────
  const updateSetting = (section, key, value) => {
    if (!isAdmin) return
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  const setToggle = (key) => {
    if (!isAdmin) return
    setSettings(prev => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: !prev.toggles[key] },
    }))
  }

  // ── Simpan semua settings ke localStorage ────────────────
  // NOTE: taxPercent yang disimpan di sini dibaca langsung oleh
  // halaman Kasir (lihat helper getTaxPercent() di Kasir.jsx),
  // jadi begitu admin ubah & simpan, perhitungan pajak di Kasir
  // otomatis ikut berubah.
  const handleSaveAll = () => {
    if (!isAdmin) return
    saveSettings(settings)
    setSaveMsg('Pengaturan berhasil disimpan.')
    setTimeout(() => setSaveMsg(null), 2500)
  }

  // ── Shared styles ────────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${COLOR.border}`, background: '#fff',
    fontSize: 13, fontFamily: 'inherit', color: COLOR.text,
    boxSizing: 'border-box', marginTop: 6, outline: 'none',
  }

  const disabledInputStyle = {
    ...inputStyle,
    opacity: 0.6,
    cursor: 'not-allowed',
    background: '#F4F5F7',
  }

  const cardStyle = {
    background:   COLOR.card,
    border:       `1px solid ${COLOR.border}`,
    borderRadius: 12,
    padding:      isMobile ? 16 : 24,
  }

  // ── Format log transaksi sebagai activity log ─────────────
  const activityLogs = (transaksiList?.data ?? transaksiList ?? []).slice(0, 5).map(t => ({
    id:       t.no_transaksi,
    time:     t.waktu ? new Date(t.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-',
    category: 'Transaction',
    desc:     `${t.no_transaksi} — ${t.metode_pembayaran?.toUpperCase() ?? '-'} — Rp ${parseFloat(t.total_bayar ?? 0).toLocaleString('id-ID')} by ${t.user?.nama_lengkap ?? 'Kasir'}`,
  }))

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ paddingTop: 24 }}>

      {/* Success toast */}
      {saveMsg && (
        <div style={{
          background:   '#DCFCE7',
          border:       '1px solid #86EFAC',
          borderRadius: 8,
          padding:      '10px 16px',
          fontSize:     13,
          color:        '#16A34A',
          marginBottom: 16,
        }}>
          ✓ {saveMsg}
        </div>
      )}

      {!isAdmin && (
        <div style={{
          background:   '#FEF3C7',
          border:       '1px solid #FDE68A',
          borderRadius: 8,
          padding:      '10px 16px',
          fontSize:     13,
          color:        '#92400E',
          marginBottom: 16,
        }}>
          Halaman ini hanya bisa diubah oleh Admin. Kamu bisa melihat pengaturan, tapi tidak bisa mengeditnya.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Informasi Akun & Cabang ── */}
        {/*
          NOTE: Section ini masih menampilkan info akun yang SEDANG LOGIN
          (readonly), BUKAN form untuk admin membuat akun kasir baru.
          Membuat form "Tambah Akun Kasir" butuh endpoint backend baru
          (mis. POST /api/users) yang belum ada di AuthController kamu.
          Begitu endpoint itu tersedia, section ini bisa diganti jadi
          form pembuatan akun kasir per cabang.
        */}
        <div style={cardStyle}>
          <div style={{
            display:        'flex',
            flexDirection:  isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems:     isMobile ? 'flex-start' : 'center',
            gap:            isMobile ? 12 : 0,
            marginBottom:   16,
          }}>
            <SectionTitle icon={Store} title="Informasi Akun & Cabang" />
            {isAdmin && (
              <PrimaryBtn icon={Save} onClick={handleSaveAll}>Simpan Pengaturan</PrimaryBtn>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Nama</label>
              <input style={disabledInputStyle} type="text" value={userNama} readOnly />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Role</label>
              <input style={{ ...disabledInputStyle, textTransform: 'capitalize' }} type="text" value={userRole} readOnly />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Email</label>
              <input style={disabledInputStyle} type="email" value={userEmail} readOnly />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Cabang</label>
              <input style={disabledInputStyle} type="text" value={cabangNama} readOnly />
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: COLOR.textMuted }}>
            Untuk mengubah informasi akun atau menambah akun kasir baru, fitur ini masih dalam pengembangan.
          </div>
        </div>

        {/* ── Inventory & Transaction ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 24 }}>

          {/* Inventory & Stock */}
          <div style={cardStyle}>
            <SectionTitle icon={Package} title="Inventory & Stock" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Low Stock Threshold</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Alert when stock hits below units</div>
                </div>
                <input
                  style={{
                    ...(isAdmin ? inputStyle : disabledInputStyle),
                    width: 60, textAlign: 'center', marginTop: 0, flexShrink: 0,
                  }}
                  type="number"
                  value={settings.inventory.lowStockThreshold}
                  onChange={e => updateSetting('inventory', 'lowStockThreshold', parseInt(e.target.value) || 0)}
                  disabled={!isAdmin}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Negative Stock Protection</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Prevent sales of out-of-stock items</div>
                </div>
                <Toggle value={settings.toggles.negativeStock} onToggle={() => setToggle('negativeStock')} disabled={!isAdmin} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>SKU Auto-generation</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Automatic unique ID creation</div>
                </div>
                <Toggle value={settings.toggles.skuAuto} onToggle={() => setToggle('skuAuto')} disabled={!isAdmin} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Barcode Scanner Integration</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Enable HID/USB scanner support</div>
                </div>
                <Toggle value={settings.toggles.barcode} onToggle={() => setToggle('barcode')} disabled={!isAdmin} />
              </div>
            </div>
          </div>

          {/* Transaction Settings */}
          <div style={cardStyle}>
            <SectionTitle icon={CreditCard} title="Transaction Settings" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Tax Percentage (PPN)</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Global tax applied to all transactions</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <input
                    style={{
                      ...(isAdmin ? inputStyle : disabledInputStyle),
                      width: 60, textAlign: 'center', marginTop: 0,
                    }}
                    type="number"
                    value={settings.transaction.taxPercent}
                    onChange={e => updateSetting('transaction', 'taxPercent', parseFloat(e.target.value) || 0)}
                    disabled={!isAdmin}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>%</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Invoice Prefix</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Starting characters for invoices</div>
                </div>
                <input
                  style={{
                    ...(isAdmin ? inputStyle : disabledInputStyle),
                    width: 80, marginTop: 0, flexShrink: 0,
                  }}
                  type="text"
                  value={settings.transaction.invoicePrefix}
                  onChange={e => updateSetting('transaction', 'invoicePrefix', e.target.value)}
                  disabled={!isAdmin}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Auto-print Receipt</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>After transaction success</div>
                </div>
                <Toggle value={settings.toggles.autoprint} onToggle={() => setToggle('autoprint')} disabled={!isAdmin} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Member, Security, Alerts ── */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
          gap:                 24,
        }}>

          {/* Member & Loyalty */}
          <div style={cardStyle}>
            <SectionTitle icon={Users} title="Member & Loyalty" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Point System</span>
              <Toggle value={settings.toggles.pointSystem} onToggle={() => setToggle('pointSystem')} disabled={!isAdmin} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: COLOR.textSub }}>Point per Rp 10.000 transaksi</label>
              <input
                style={isAdmin ? inputStyle : disabledInputStyle}
                type="number"
                value={settings.loyalty.pointPer1000}
                onChange={e => updateSetting('loyalty', 'pointPer1000', parseInt(e.target.value) || 0)}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: COLOR.textSub }}>Tiers (otomatis dari poin)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                {[
                  { label: 'Bronze  (0 – 2.999 poin)',    bg: '#F9FAFB', border: COLOR.border,  color: COLOR.text,    fw: 400 },
                  { label: 'Silver  (3.000 – 6.999 poin)',bg: '#F0F9FF', border: '#BAE6FD',     color: '#0369A1',     fw: 600 },
                  { label: 'Gold    (7.000 – 9.999 poin)',bg: '#FEF3C7', border: '#FDE68A',     color: '#92400E',     fw: 600 },
                  { label: 'Platinum (10.000+ poin)',      bg: '#F3F4F6', border: COLOR.border,  color: '#374151',     fw: 700 },
                ].map((tier, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', background: tier.bg,
                    borderRadius: 6, fontSize: 12,
                    border: `1px solid ${tier.border}`,
                    color: tier.color, fontWeight: tier.fw,
                  }}>
                    {tier.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backup & Security */}
          {/*
            NOTE: Tombol "Manual Backup Now" dan dropdown frekuensi di
            bawah ini BELUM tersambung ke backend — belum ada endpoint
            backup di Laravel (mis. POST /api/backup) atau job terjadwal
            di app/Console/Kernel.php. Keduanya masih murni tampilan.
          */}
          <div style={cardStyle}>
            <SectionTitle icon={Shield} title="Backup & Security" />
            <button
              disabled={!isAdmin}
              style={{
                width: '100%', padding: '10px',
                background: COLOR.amberLight,
                color: COLOR.amberDark,
                border: `1px solid ${COLOR.amber}`,
                borderRadius: 8, fontWeight: 600, fontSize: 13,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: 8,
                cursor: isAdmin ? 'pointer' : 'not-allowed',
                opacity: isAdmin ? 1 : 0.5,
                marginBottom: 16, fontFamily: 'inherit',
              }}
            >
              <Clock size={16} /> Manual Backup Now
            </button>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: COLOR.textSub }}>Auto-Backup Frequency</label>
              <select style={isAdmin ? inputStyle : disabledInputStyle} disabled={!isAdmin}>
                <option>Daily at 12:00 AM</option>
                <option>Weekly on Sunday</option>
                <option>Monthly</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Two-Factor Auth (2FA)</span>
              <Toggle value={settings.toggles.twofa} onToggle={() => setToggle('twofa')} disabled={!isAdmin} />
            </div>
          </div>

          {/* Alerts */}
          <div style={{ ...cardStyle, gridColumn: (!isMobile && isTablet) ? '1 / -1' : 'auto' }}>
            <SectionTitle icon={Bell} title="Alerts" />
            <div style={{
              display:             'grid',
              gridTemplateColumns: (!isMobile && isTablet) ? '1fr 1fr' : '1fr',
              gap:                 12,
            }}>
              {[
                { key: 'lowStock',      label: 'Low Stock Alerts'        },
                { key: 'dailySummary',  label: 'Daily Sales Summary'     },
                { key: 'auditMismatch', label: 'Stock Mismatch Audit'    },
                { key: 'failedTrx',    label: 'Failed Transaction'       },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <input
                    type="checkbox"
                    checked={settings.alerts[key]}
                    onChange={() => updateSetting('alerts', key, !settings.alerts[key])}
                    disabled={!isAdmin}
                    style={{
                      accentColor: COLOR.amber, width: 16, height: 16,
                      cursor: isAdmin ? 'pointer' : 'not-allowed',
                      opacity: isAdmin ? 1 : 0.5,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity Log (dari API transaksi terakhir) ── */}
        <div style={cardStyle}>
          <div style={{
            display:        'flex',
            flexDirection:  isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems:     isMobile ? 'flex-start' : 'center',
            gap:            isMobile ? 8 : 0,
            marginBottom:   16,
          }}>
            <SectionTitle icon={History} title="Activity Logs (Transaksi Terakhir)" />
            <span style={{ fontSize: 12, color: COLOR.amber, cursor: 'pointer', fontWeight: 600 }}>
              Lihat Semua &gt;&gt;
            </span>
          </div>

          {loadingLog ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
              <Loader size={18} color={COLOR.amber} />
              <div style={{ marginTop: 8 }}>Memuat log aktivitas...</div>
            </div>
          ) : activityLogs.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: COLOR.textMuted, fontSize: 13 }}>
              Belum ada transaksi tercatat.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activityLogs.map((log, index) => (
                <div key={log.id} style={{
                  display:       'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems:    isMobile ? 'flex-start' : 'center',
                  gap:           isMobile ? 4 : 0,
                  padding:       '12px 0',
                  borderBottom:  index !== activityLogs.length - 1 ? `1px solid ${COLOR.border}` : 'none',
                }}>
                  {isMobile ? (
                    <>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: COLOR.textSub }}>{log.time}</span>
                        <span style={{ fontSize: 11, color: COLOR.textMuted, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>
                          {log.category}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontSize: 13, color: COLOR.text, flex: 1 }}>{log.desc}</span>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLOR.amber, flexShrink: 0 }}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ width: 100, fontSize: 13, fontWeight: 500, color: COLOR.textSub }}>{log.time}</span>
                      <span style={{ width: 120, fontSize: 13, color: COLOR.textMuted }}>{log.category}</span>
                      <span style={{ flex: 1, fontSize: 13, color: COLOR.text }}>{log.desc}</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLOR.amber }}>
                        <MoreVertical size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}