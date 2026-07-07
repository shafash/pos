import { useState } from 'react'
import { COLOR } from './constants/colors'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Kasir from './pages/Kasir'
import StokBarang from './pages/StokBarang'
import DataMember from './pages/DataMember'
import Laporan from './pages/Laporan'
import Settings from './pages/Settings'
import AuditBarang from './pages/AuditBarang'
import TambahBarang from './pages/TambahBarang'
import EditBarang from './pages/EditBarang'
import TambahMember from './pages/TambahMember'
import EditMember from './pages/EditMember'
import Login from './pages/Login'
import { useIsMobile } from './hooks/useIsMobile'

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  kasir:        'Kasir',
  stok:         'Stok Barang',
  member:       'Data Member',
  laporan:      'Laporan',
  settings:     'Settings',
  audit:        'Audit Stok',
  tambahBarang: 'Tambah Barang',
  editBarang:   'Edit Barang',
  tambahMember: 'Tambah Member',
  editMember:   'Edit Member',
}

const PAGES = (onNav) => ({
  dashboard:    <Dashboard />,
  kasir:        <Kasir />,
  stok:         <StokBarang onNav={onNav} />,
  audit:        <AuditBarang />,
  member:       <DataMember onNav={onNav} />,
  laporan:      <Laporan />,
  settings:     <Settings />,
  tambahBarang: <TambahBarang onNav={onNav} />,
  editBarang:   <EditBarang onNav={onNav} />,
  tambahMember: <TambahMember onNav={onNav} />,
  editMember:   <EditMember onNav={onNav} />,
})

export default function App() {
  const [isLoggedIn, setIsLoggedIn]             = useState(false)
  const [page, setPage]                         = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen]             = useState(false)

  const isMobile     = useIsMobile()
  const sidebarWidth = sidebarCollapsed ? 72 : 220
  const isKasir      = page === 'kasir'
  const mainMarginLeft = isMobile ? 0 : sidebarWidth

  // ── Belum login → tampilkan halaman Login ──
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  // ── Sudah login → tampilkan app normal ─────
  return (
    <div style={{
      fontFamily: "'Geist', sans-serif",
      background: COLOR.bg,
      minHeight:  '100vh',
    }}>
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Topbar
        title={PAGE_TITLES[page]}
        sidebarWidth={sidebarWidth}
        onOpenMobile={() => setMobileOpen(true)}
      />

      <main style={{
        marginLeft: mainMarginLeft,
        padding:    isKasir
          ? '56px 0 0 0'
          : (isMobile ? '56px 16px 24px' : '56px 32px 32px 32px'),
        minHeight:  '100vh',
        transition: 'margin-left 0.2s',
      }}>
        {PAGES(setPage)[page] ?? <Dashboard />}
      </main>
    </div>
  )
}