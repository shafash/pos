import {
  LayoutDashboard, ShoppingCart, Package,
  Users, FileText, Settings, LogOut, PanelLeft, ChevronRight, X,
  MoreVertical,
} from 'lucide-react'
import { COLOR } from '../../constants/colors'
import Badge from '../ui/Badge'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useAuth } from '../../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { key: 'kasir',     label: 'Kasir',       icon: ShoppingCart    },
  { key: 'stok',      label: 'Stok Barang', icon: Package         },
  { key: 'member',    label: 'Data Member', icon: Users           },
  { key: 'laporan',   label: 'Laporan',     icon: FileText        },
]

export default function Sidebar({
  active, onNav, collapsed, onToggleCollapse, mobileOpen, onCloseMobile,
}) {
  const isMobile = useIsMobile()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  const width     = isMobile ? 220 : (collapsed ? 72 : 220)
  const showLabel = isMobile || !collapsed

  // Inisial nama untuk avatar
  const initials = user?.nama_lengkap
    ? user.nama_lengkap.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  const handleNav = (key) => {
    onNav(key)
    if (isMobile) onCloseMobile()
  }

  const handleLogout = async () => {
    await logout()
    // AuthContext akan set user = null → App.jsx otomatis redirect ke Login
  }

  useEffect(() => {
  if (!showUserMenu) return

  const handleClickOutside = (e) => {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setShowUserMenu(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 19 }}
        />
      )}

      <aside style={{
        width,
        minHeight:     '100vh',
        background:    COLOR.sidebar,
        borderRight:   `1px solid ${COLOR.border}`,
        display:       'flex',
        flexDirection: 'column',
        position:      'fixed',
        top:           0,
        left:          isMobile ? (mobileOpen ? 0 : -220) : 0,
        zIndex:        20,
        transition:    'left 0.25s ease, width 0.2s',
        overflow:      'hidden',
      }}>

        {/* Logo */}
        <div style={{
          padding:        '20px 20px 10px',
          display:        'flex',
          alignItems:     'center',
          gap:            10,
          justifyContent: showLabel ? 'flex-start' : 'center',
        }}>
          {showLabel && (
            <span style={{ fontWeight: 500, fontSize: 13, color: COLOR.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              POS Rakryan
            </span>
          )}
          {isMobile ? (
            <X size={18} color={COLOR.textMuted} onClick={onCloseMobile} style={{ marginLeft: 'auto', cursor: 'pointer', flexShrink: 0 }} />
          ) : (
            <PanelLeft size={18} color={COLOR.textMuted} onClick={onToggleCollapse} style={{ marginLeft: collapsed ? 0 : 'auto', cursor: 'pointer', flexShrink: 0 }} />
          )}
        </div>

        {showLabel && (
          <div style={{ padding: '8px 16px 4px', fontSize: 11, color: COLOR.textMuted, fontWeight: 600, letterSpacing: 1, whiteSpace: 'nowrap' }}>
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
                onClick={() => handleNav(key)}
                title={!showLabel ? label : undefined}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: showLabel ? 'flex-start' : 'center',
                  gap:            10,
                  width:          '100%',
                  padding:        showLabel ? '10px 12px' : '10px 0',
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
                {showLabel && label}
              </button>
            )
          })}
        </nav>

        {/* Bottom: user info + settings + logout */}
        <div style={{ padding: showLabel ? '16px 16px 8px' : '16px 0 8px', borderTop: `1px solid ${COLOR.border}` }}>

          {!isMobile && collapsed && (
            <button
              onClick={onToggleCollapse}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                border: `1px solid ${COLOR.border}`, background: '#fff',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <ChevronRight size={14} color={COLOR.textMuted} />
            </button>
          )}

          {/* Avatar + nama user + tombol titik tiga */}
          <div
            ref={userMenuRef}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: showLabel ? 'flex-start' : 'center',
              gap:            10,
              marginBottom:   16,
              position:       'relative',
            }}
          >
            <div style={{
              width:          36, height: 36, borderRadius: '50%',
              background:     COLOR.amberLight,
              display:        'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight:     800, color: COLOR.amber, fontSize: 14, flexShrink: 0,
            }}>
              {initials}
            </div>

            {showLabel && (
              <>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.nama_lengkap ?? 'User'}
                  </div>
                  <Badge color="amber" style={{ textTransform: 'capitalize' }}>
                    {user?.role ?? 'kasir'}
                  </Badge>
                </div>

                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: 4, borderRadius: 6, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <MoreVertical size={16} color={COLOR.textMuted} />
                </button>
              </>
            )}

            {/* Popup menu Settings + Log out */}
            {showUserMenu && showLabel && (
              <div style={{
                position:     'absolute',
                bottom:       '110%',
                right:        0,
                background:   '#fff',
                border:       `1px solid ${COLOR.border}`,
                borderRadius: 8,
                boxShadow:    '0 4px 16px rgba(0,0,0,0.12)',
                minWidth:     160,
                overflow:     'hidden',
                zIndex:       25,
              }}>
                <button
                  onClick={() => { handleNav('settings'); setShowUserMenu(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '10px 14px',
                    border: 'none', cursor: 'pointer',
                    background: active === 'settings' ? COLOR.amberLight : 'transparent',
                    color: active === 'settings' ? COLOR.amberDark : COLOR.textSub,
                    fontSize: 13, fontWeight: active === 'settings' ? 700 : 400,
                    fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <Settings size={15} style={{ flexShrink: 0 }} />
                  Settings
                </button>
                <button
                  onClick={() => { handleLogout(); setShowUserMenu(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '10px 14px',
                    border: 'none', cursor: 'pointer',
                    background: 'transparent', color: COLOR.red,
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    textAlign: 'left', borderTop: `1px solid ${COLOR.border}`,
                  }}
                >
                  <LogOut size={15} style={{ flexShrink: 0 }} />
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Mode collapsed (desktop, tanpa label): tampilkan icon Settings & Logout langsung */}
          {!showLabel && (
            <>
              <button
                onClick={() => handleNav('settings')}
                title="Settings"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '8px 0', borderRadius: 6,
                  border: 'none', cursor: 'pointer',
                  background: active === 'settings' ? COLOR.amberLight : 'transparent',
                  color: active === 'settings' ? COLOR.amberDark : COLOR.textSub,
                  marginBottom: 4,
                }}
              >
                <Settings size={15} />
              </button>
              <button
                onClick={handleLogout}
                title="Log out"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '8px 0', borderRadius: 6,
                  border: 'none', cursor: 'pointer',
                  background: 'transparent', color: COLOR.red,
                }}
              >
                <LogOut size={15} />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}