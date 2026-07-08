import { useState } from 'react'
import { COLOR } from './constants/colors'
import Sidebar      from './components/layout/Sidebar'
import Topbar       from './components/layout/Topbar'
import Dashboard    from './pages/Dashboard'
import Kasir        from './pages/Kasir'
import StokBarang   from './pages/StokBarang'
import DataMember   from './pages/DataMember'
import Laporan      from './pages/Laporan'
import Settings     from './pages/Settings'
import AuditBarang  from './pages/AuditBarang'
import TambahBarang from './pages/TambahBarang'
import EditBarang   from './pages/EditBarang'
import TambahMember from './pages/TambahMember'
import EditMember   from './pages/EditMember'
import Login        from './pages/Login'
import { useIsMobile } from './hooks/useIsMobile'
import { useAuth }     from './context/AuthContext'

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

export default function App() {
  const { user, loading: loadingAuth, logout } = useAuth()

  const [page,              setPage]              = useState('dashboard')
  const [pageParams,        setPageParams]        = useState(null)
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false)
  const [mobileOpen,        setMobileOpen]        = useState(false)

  const isMobile     = useIsMobile()
  const sidebarWidth = sidebarCollapsed ? 72 : 220
  const isKasir      = page === 'kasir'

  const handleNav = (targetPage, params = null) => {
    setPage(targetPage)
    setPageParams(params)
    setMobileOpen(false) // tutup sidebar mobile saat navigasi
  }

  if (loadingAuth) {
    return (
      <div style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     COLOR.bg,
        fontFamily:     "'Geist', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width:        40,
            height:       40,
            border:       `3px solid ${COLOR.border}`,
            borderTop:    `3px solid ${COLOR.amber}`,
            borderRadius: '50%',
            animation:    'spin 0.8s linear infinite',
            margin:       '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <div style={{ fontSize: 13, color: '#888' }}>Memuat...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Login
        onLogin={() => {
          setPage('dashboard')
          setPageParams(null)
        }}
      />
    )
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <Dashboard />
      case 'kasir':        return <Kasir />
      case 'stok':         return <StokBarang onNav={handleNav} />
      case 'audit':        return <AuditBarang />
      case 'member':       return <DataMember onNav={handleNav} />
      case 'laporan':      return <Laporan />
      case 'settings':     return <Settings />
      case 'tambahBarang': return <TambahBarang onNav={handleNav} />
      case 'tambahMember': return <TambahMember onNav={handleNav} />

      // EditBarang & EditMember butuh params (sku / id_member)
      case 'editBarang':
        return <EditBarang onNav={handleNav} params={pageParams} />
      case 'editMember':
        return <EditMember onNav={handleNav} params={pageParams} />

      default:
        return <Dashboard />
    }
  }

  return (
    <div style={{
      fontFamily: "'Geist', sans-serif",
      background: COLOR.bg,
      minHeight:  '100vh',
    }}>
      <Sidebar
        active={page}
        onNav={handleNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={logout}
      />
      <Topbar
        title={PAGE_TITLES[page] ?? 'POS Elang Anugerah'}
        sidebarWidth={sidebarWidth}
        onOpenMobile={() => setMobileOpen(true)}
        user={user}
        onLogout={logout}
      />

      <main style={{
        marginLeft: isMobile ? 0 : sidebarWidth,
        padding:    isKasir
          ? '56px 0 0 0'
          : (isMobile ? '56px 16px 24px' : '56px 32px 32px 32px'),
        minHeight:  '100vh',
        transition: 'margin-left 0.2s',
      }}>
        {renderPage()}
      </main>
    </div>
  )
}