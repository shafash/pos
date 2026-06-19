import {
  LayoutDashboard, ShoppingCart, Package,
  Users, FileText, Settings, LogOut, PanelLeft, ChevronRight,
} from 'lucide-react'
import { COLOR } from '../../constants/colors'
import Badge from '../ui/Badge'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { key: 'kasir',     label: 'Kasir',       icon: ShoppingCart    },
  { key: 'stok',      label: 'Stok Barang', icon: Package         },
  { key: 'member',    label: 'Data Member', icon: Users           },
  { key: 'laporan',   label: 'Laporan',     icon: FileText        },
]

/**
 * @param {{ active: string, onNav: (key: string) => void, collapsed: boolean, onToggleCollapse: () => void }} props
 */
export default function Sidebar({ active, onNav, collapsed, onToggleCollapse }) {
  const width = collapsed ? 72 : 220

  return (
    <aside
      style={{
        width,
        minHeight:     '100vh',
        background:    COLOR.sidebar,
        borderRight:   `1px solid ${COLOR.border}`,
        display:       'flex',
        flexDirection: 'column',
        position:      'fixed',
        top:           0,
        left:          0,
        zIndex:        10,
        transition:    'width 0.2s',
        overflow:      'hidden',
      }}
    >
      {/* ── Logo ─────────────────────────────── */}
      <div style={{
        padding:        '20px 20px 10px',
        display:        'flex',
        alignItems:     'center',
        gap:            10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {!collapsed && (
          <span style={{ fontWeight: 500, fontSize: 13, color: COLOR.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            POS ElangAnugerah
          </span>
        )}
        <PanelLeft
          size={18}
          color={COLOR.textMuted}
          onClick={onToggleCollapse}
          style={{ marginLeft: collapsed ? 0 : 'auto', cursor: 'pointer', flexShrink: 0 }}
        />
      </div>

      {/* Label Menu */}
      {!collapsed && (
        <div style={{
          padding:       '8px 16px 4px',
          fontSize:      11,
          color:         COLOR.textMuted,
          fontWeight:    600,
          letterSpacing: 1,
          whiteSpace:    'nowrap',
        }}>
          Menu
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 10px' }}>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onNav(key)}
              title={collapsed ? label : undefined}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap:            10,
                width:          '100%',
                padding:        collapsed ? '10px 0' : '10px 12px',
                borderRadius:   8,
                border:         'none',
                cursor:         'pointer',
                background:     isActive ? COLOR.amberLight : 'transparent',
                color:          isActive ? COLOR.amberDark  : COLOR.textSub,
                fontWeight:     isActive ? 700 : 400,
                fontSize:       13,
                marginBottom:   2,
                fontFamily:     'inherit',
                transition:     'all 0.15s',
                textAlign:      'left',
                whiteSpace:     'nowrap',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </button>
          )
        })}
      </nav>

      {/* ── User + Bottom ─────────────────────── */}
      <div style={{
        padding:    collapsed ? '16px 0 8px' : '16px 16px 8px',
        borderTop:  `1px solid ${COLOR.border}`,
      }}>

        {/* Tombol expand saat collapsed */}
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              width:          32,
              height:         32,
              borderRadius:   '50%',
              border:         `1px solid ${COLOR.border}`,
              background:     '#fff',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              margin:         '0 auto 16px',
            }}
          >
            <ChevronRight size={14} color={COLOR.textMuted} />
          </button>
        )}

        {/* Avatar */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap:            10,
          marginBottom:   16,
        }}>
          <div style={{
            width:          36,
            height:         36,
            borderRadius:   '50%',
            background:     COLOR.amberLight,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontWeight:     800,
            color:          COLOR.amber,
            fontSize:       14,
            flexShrink:     0,
          }}>
            A
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.text, whiteSpace: 'nowrap' }}>
                Alex Bizher
              </div>
              <Badge color="amber">Admin</Badge>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => onNav('settings')}
          title={collapsed ? 'Settings' : undefined}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap:            8,
            width:          '100%',
            padding:        collapsed ? '8px 0' : '8px 10px',
            borderRadius:   6,
            border:         'none',
            cursor:         'pointer',
            background:     active === 'settings' ? COLOR.amberLight : 'transparent',
            color:          active === 'settings' ? COLOR.amberDark  : COLOR.textSub,
            fontSize:       13,
            fontWeight:     active === 'settings' ? 700 : 400,
            marginBottom:   4,
            fontFamily:     'inherit',
          }}
        >
          <Settings size={15} style={{ flexShrink: 0 }} />
          {!collapsed && 'Settings'}
        </button>

        {/* Logout */}
        <button
          title={collapsed ? 'Log out' : undefined}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap:            8,
            width:          '100%',
            padding:        collapsed ? '8px 0' : '8px 10px',
            borderRadius:   6,
            border:         'none',
            cursor:         'pointer',
            background:     'transparent',
            color:          COLOR.red,
            fontSize:       13,
            fontWeight:     600,
            fontFamily:     'inherit',
          }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && 'Log out'}
        </button>
      </div>
    </aside>
  )
}