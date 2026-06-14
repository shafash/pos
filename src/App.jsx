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

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  kasir:     'Kasir',
  stok:      'Stok Barang',
  member:    'Data Member',
  laporan:   'Laporan',
  settings:  'Settings',
  audit:     'Audit Stok',
}

const PAGES = (onNav) => ({
  dashboard: <Dashboard />,
  kasir:     <Kasir />,
  stok:      <StokBarang onNav={onNav} />,
  audit:     <AuditBarang />,
  member:    <DataMember />,
  laporan:   <Laporan />,
  settings:  <Settings />,
})

export default function App() {
  const [page, setPage] = useState('dashboard')
  const isKasir = page === 'kasir'

  return (
    <div style={{
      fontFamily: "'Geist', sans-serif",
      background: COLOR.bg,
      minHeight:  '100vh',
    }}>
      <Sidebar active={page} onNav={setPage} />
      <Topbar title={PAGE_TITLES[page]} />

      <main style={{
        marginLeft: 220,
        padding: isKasir ? '56px 0 0 0' : '56px 32px 32px 32px',
        minHeight: '100vh',
      }}>
        {PAGES(setPage)[page] ?? <Dashboard />}
      </main>
    </div>
  )
}