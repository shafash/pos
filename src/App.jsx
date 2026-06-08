import { useState } from 'react'
import { COLOR } from './constants/colors'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Kasir from './pages/Kasir'
import StokBarang from './pages/StokBarang'
import DataMember from './pages/DataMember'
import Laporan from './pages/Laporan'
import Settings from './pages/Settings'

const PAGES = {
  dashboard: <Dashboard />,
  kasir: <Kasir />,
  stok: <StokBarang />,
  member: <DataMember />,
  laporan: <Laporan />,
  settings: <Settings />,
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const isKasir = page === 'kasir'

  return (
    <div style={{
      fontFamily: "'Geist', 'Poppins', sans-serif",
      background: COLOR.bg,
      minHeight: '100vh',
    }}>
      <Sidebar active={page} onNav={setPage} />

      <main style={{
        marginLeft: 200,
        padding: isKasir ? '32px 0 32px 32px' : 32,
        minHeight: '100vh',
      }}>
        {PAGES[page] ?? <Dashboard />}
      </main>
    </div>
  )
}