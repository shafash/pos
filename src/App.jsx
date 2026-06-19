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

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  kasir:     'Kasir',
  stok:      'Stok Barang',
  member:    'Data Member',
  laporan:   'Laporan',
  settings:  'Settings',
  audit:     'Audit Stok',
  tambahBarang: 'Tambah Barang',
  editBarang: 'Edit Barang',
  tambahMember: 'Tambah Member',
  editMember: 'Edit Member',
}

const PAGES = (onNav) => ({
  dashboard: <Dashboard />,
  kasir:     <Kasir />,
  stok:      <StokBarang onNav={onNav} />,
  audit:     <AuditBarang />,
  member:    <DataMember onNav={onNav} />,
  laporan:   <Laporan />,
  settings:  <Settings />,
  tambahBarang: <TambahBarang onNav={onNav} />,
  editBarang: <EditBarang onNav={onNav} />,
  tambahMember: <TambahMember onNav={onNav} />,
  editMember: <EditMember onNav={onNav} />,
})

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) 
  const sidebarWidth = sidebarCollapsed ? 72 : 220
  const isKasir = page === 'kasir'

  return (
    <div style={{
      fontFamily: "'Geist', sans-serif",
      background: COLOR.bg,
      minHeight:  '100vh',
    }}>
      <Sidebar active={page} onNav={setPage} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(c => !c)}/>
      <Topbar title={PAGE_TITLES[page]} sidebarWidth={sidebarWidth} />

      <main style={{
        marginLeft: sidebarWidth,
        padding: isKasir ? '56px 0 0 0' : '56px 32px 32px 32px',
        minHeight: '100vh',
      }}>
        {PAGES(setPage)[page] ?? <Dashboard />}
      </main>
    </div>
  )
}