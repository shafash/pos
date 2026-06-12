import {
  LayoutDashboard, ShoppingCart, Package,
  Users, FileText, Settings, LogOut, Menu,
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
 * @param {{ active: string, onNav: (key: string) => void }} props
 */
export default function Sidebar({ active, onNav }) {
  return (
    <aside
      style={{
        width:         220,
        minHeight:     '100vh',
        background:    COLOR.sidebar,
        borderRight:   `1px solid ${COLOR.border}`,
        display:       'flex',
        flexDirection: 'column',
        position:      'fixed',
        top:           0,
        left:          0,
        zIndex:        10,
      }}
    >
      <div style={{
        padding:    '20px 20px 10px',
        display:    'flex',
        alignItems: 'center',
        gap:        10,
      }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: COLOR.text, lineHeight: 1.2 }}>
          POS ElangAnugerah
        </span>
        <Menu
          size={18}
          color={COLOR.textMuted}
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
        />
      </div>

      <div style={{
        padding:       '8px 16px 4px',
        fontSize:      11,
        color:         COLOR.textMuted,
        fontWeight:    600,
        letterSpacing: 1,
      }}>
        Menu
      </div>

      <nav style={{ flex: 1, padding: '0 10px' }}>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onNav(key)}
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         10,
                width:       '100%',
                padding:     '10px 12px',
                borderRadius: 8,
                border:      'none',
                cursor:      'pointer',
                background:  isActive ? COLOR.amberLight : 'transparent',
                color:       isActive ? COLOR.amberDark  : COLOR.textSub,
                fontWeight:  isActive ? 700 : 400,
                fontSize:    13,
                marginBottom: 2,
                fontFamily:  'inherit',
                transition:  'all 0.15s',
                textAlign:   'left',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      <div style={{
        padding:    '16px 16px 8px',
        borderTop:  `1px solid ${COLOR.border}`,
      }}>
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        10,
          marginBottom: 16,
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
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.text }}>
              Alex Bizher
            </div>
            <Badge color="amber">Admin</Badge>
          </div>
        </div>

        <button
          onClick={() => onNav('settings')}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         8,
            width:       '100%',
            padding:     '8px 10px',
            borderRadius: 6,
            border:      'none',
            cursor:      'pointer',
            background:  active === 'settings' ? COLOR.amberLight : 'transparent',
            color:       active === 'settings' ? COLOR.amberDark  : COLOR.textSub,
            fontSize:    13,
            fontWeight:  active === 'settings' ? 700 : 400,
            marginBottom: 4,
            fontFamily:  'inherit',
          }}
        >
          <Settings size={15} />
          Settings
        </button>

        <button
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        8,
            width:      '100%',
            padding:    '8px 10px',
            borderRadius: 6,
            border:     'none',
            cursor:     'pointer',
            background: 'transparent',
            color:      COLOR.red,
            fontSize:   13,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  )
}
