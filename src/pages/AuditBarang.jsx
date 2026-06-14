import { useState } from 'react'
import { Search, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { COLOR } from '../constants/colors'

const sessionActivity = [
  { id: 1, nama: 'Incoe Gold N50',        status: 'match', info: 'Count: 12 (Match)'  },
  { id: 2, nama: 'Amaron Hi-Life 55D23L', status: 'diff',  info: 'Diff: -2 Unit'      },
  { id: 3, nama: 'Bosch MF 46B24L',       status: 'match', info: 'Count: 15 (Match)'  },
]

export default function AuditBarang() {
  const [search, setSearch]       = useState('')
  const [actualCount, setActualCount] = useState(24)
  const systemStock = 22
  const diff = actualCount - systemStock

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

      {/* ── Kolom Kiri ───────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Search Bar */}
        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding:      '14px 20px',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <Search size={18} color={COLOR.textMuted} />
            <input
              placeholder="Cari nama produk atau scan barcode"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border:     'none',
                outline:    'none',
                fontSize:   14,
                color:      COLOR.text,
                background: 'transparent',
                width:      '100%',
                fontFamily: 'inherit',
              }}
            />
          </div>
          {/* Barcode icon */}
          <div style={{ color: COLOR.amber, cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2"  y="4" width="2" height="16" fill={COLOR.amber} />
              <rect x="6"  y="4" width="1" height="16" fill={COLOR.amber} />
              <rect x="9"  y="4" width="2" height="16" fill={COLOR.amber} />
              <rect x="13" y="4" width="1" height="16" fill={COLOR.amber} />
              <rect x="16" y="4" width="2" height="16" fill={COLOR.amber} />
              <rect x="20" y="4" width="2" height="16" fill={COLOR.amber} />
            </svg>
          </div>
        </div>

        {/* Active Audit Card */}
        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          overflow:     'hidden',
        }}>
          {/* Banner */}
          <div style={{
            background:  COLOR.amberLight,
            padding:     '14px 20px',
            fontWeight:  700,
            fontSize:    14,
            color:       COLOR.amberDark,
            letterSpacing: 0.5,
          }}>
            ACTIVE AUDIT SISTEM
          </div>

          {/* Content */}
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

              {/* Product Image */}
              <div style={{
                width:          120,
                height:         120,
                background:     '#1A3A0A',
                borderRadius:   10,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}>
                <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 22 }}>GS</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                {/* Stock Info */}
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', marginBottom: 24 }}>
                  {/* System Stock */}
                  <div>
                    <div style={{ fontSize: 12, color: COLOR.textMuted, marginBottom: 4 }}>System Stock</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: COLOR.text }}>{systemStock}</div>
                  </div>

                  {/* Actual Count */}
                  <div style={{
                    border:       `2px solid ${COLOR.amber}`,
                    borderRadius: 10,
                    padding:      '10px 16px',
                    minWidth:     120,
                  }}>
                    <div style={{ fontSize: 12, color: COLOR.amber, fontWeight: 600, marginBottom: 4 }}>Actual Count</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 32, fontWeight: 700 }}>{actualCount}</span>
                      <span style={{
                        fontSize:   14,
                        fontWeight: 700,
                        color:      diff >= 0 ? COLOR.amberDark : COLOR.red,
                      }}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>AKI GS Astra</div>
                  <div style={{ fontSize: 13, color: COLOR.textMuted }}>GS Astra MF NS40Z</div>
                </div>

                {/* Quick Physical Count */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.textMuted, letterSpacing: 1, marginBottom: 12 }}>
                    QUICK PHYSICAL COUNT
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    {['+1', '+5', '+10'].map(val => (
                      <button
                        key={val}
                        onClick={() => setActualCount(prev => prev + parseInt(val))}
                        style={{
                          flex:         1,
                          padding:      '12px 0',
                          border:       `1px solid ${COLOR.border}`,
                          borderRadius: 8,
                          background:   '#fff',
                          fontSize:     15,
                          fontWeight:   700,
                          cursor:       'pointer',
                          color:        COLOR.text,
                          fontFamily:   'inherit',
                          transition:   'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.target.style.background   = COLOR.amberLight
                          e.target.style.borderColor  = COLOR.amber
                          e.target.style.color        = COLOR.amberDark
                        }}
                        onMouseLeave={e => {
                          e.target.style.background  = '#fff'
                          e.target.style.borderColor = COLOR.border
                          e.target.style.color       = COLOR.text
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button style={{
                      flex:         1,
                      padding:      '13px 0',
                      background:   COLOR.amber,
                      color:        '#fff',
                      border:       'none',
                      borderRadius: 10,
                      fontWeight:   700,
                      fontSize:     14,
                      cursor:       'pointer',
                      fontFamily:   'inherit',
                    }}>
                      Confirm Items Count
                    </button>
                    <button style={{
                      width:          44,
                      height:         44,
                      border:         `1px solid ${COLOR.border}`,
                      borderRadius:   8,
                      background:     '#fff',
                      cursor:         'pointer',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                    }}>
                      <X size={18} color={COLOR.textMuted} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kolom Kanan ──────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Session Activity */}
        <div style={{
          background:   COLOR.card,
          border:       `1px solid ${COLOR.border}`,
          borderRadius: 12,
          padding:      20,
        }}>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   16,
          }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Session Activity</span>
            <span style={{
              background:   '#F3F4F6',
              color:        COLOR.textSub,
              fontSize:     12,
              fontWeight:   600,
              padding:      '4px 10px',
              borderRadius: 99,
            }}>
              {sessionActivity.length} Items
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sessionActivity.map((item, i) => (
              <div key={item.id} style={{
                display:      'flex',
                alignItems:   'center',
                gap:          12,
                padding:      '12px 0',
                borderBottom: i < sessionActivity.length - 1 ? `1px solid ${COLOR.border}` : 'none',
              }}>
                {/* Icon */}
                {item.status === 'match' ? (
                  <CheckCircle size={20} color="#9CA3AF" strokeWidth={1.5} />
                ) : (
                  <AlertTriangle size={20} color={COLOR.orange || '#FF8D28'} strokeWidth={1.5} />
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.nama}</div>
                  <div style={{
                    fontSize:   12,
                    color:      item.status === 'diff' ? COLOR.red : COLOR.textMuted,
                    marginTop:  2,
                  }}>
                    {item.info}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress This Session */}
        <div style={{
          background:   COLOR.brownDark || '#734A00',
          borderRadius: 12,
          padding:      24,
          color:        '#fff',
        }}>
          <div style={{
            fontSize:      11,
            fontWeight:    600,
            letterSpacing: 1,
            color:         '#D4B483',
            marginBottom:  12,
          }}>
            PROGRESS THIS SESSION
          </div>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'flex-end',
            marginBottom:   12,
          }}>
            <span style={{ fontSize: 40, fontWeight: 800 }}>82%</span>
            <span style={{ fontSize: 13, color: '#D4B483' }}>142/173 Items</span>
          </div>
          {/* Progress Bar */}
          <div style={{
            height:       6,
            background:   'rgba(255,255,255,0.2)',
            borderRadius: 99,
            overflow:     'hidden',
          }}>
            <div style={{
              height:       '100%',
              width:        '82%',
              background:   COLOR.amber,
              borderRadius: 99,
            }} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{
          display:        'flex',
          justifyContent: 'flex-end',
          gap:            12,
          marginTop:      8,
        }}>
          <button style={{
            padding:      '12px 24px',
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 10,
            background:   '#fff',
            fontSize:     14,
            fontWeight:   600,
            color:        COLOR.textMuted,
            cursor:       'pointer',
            fontFamily:   'inherit',
          }}>
            Discard Session
          </button>
          <button style={{
            padding:      '12px 24px',
            border:       'none',
            borderRadius: 10,
            background:   COLOR.amber,
            fontSize:     14,
            fontWeight:   700,
            color:        '#fff',
            cursor:       'pointer',
            fontFamily:   'inherit',
            display:      'flex',
            alignItems:   'center',
            gap:          8,
          }}>
            <CheckCircle size={16} />
            Finish & Sync Audit
          </button>
        </div>
      </div>
    </div>
  )
}