import { useMemo, useState } from 'react'
import { Search, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { COLOR } from '../constants/colors'
import { useIsMobile } from '../hooks/useIsMobile'

const sessionActivities = [
  { name: 'Incoe Gold N50',        detail: 'Count: 12 (Match)', isMatch: true  },
  { name: 'Amaron Hi-Life 55D23L', detail: 'Diff: -2 Unit',    isMatch: false },
  { name: 'Bosch MF 46B24L',       detail: 'Count: 15 (Match)', isMatch: true  },
]

const quickAdds = [1, 5, 10]

const font = "'Geist', sans-serif"

export default function AuditBarang() {
  const [searchValue, setSearchValue] = useState('')
  const [actualCount, setActualCount] = useState(24)

  const isMobile    = useIsMobile()
  const isBelow1024 = useIsMobile(1024)
  const isTablet    = isBelow1024 && !isMobile
  const isStacked   = isMobile || isTablet

  const systemStock     = 22
  const progressCurrent = 142
  const progressTotal   = 173
  const progressPercent = Math.round((progressCurrent / progressTotal) * 100)
  const diff            = actualCount - systemStock
  const progressWidth   = useMemo(() => `${(progressCurrent / progressTotal) * 100}%`, [])

  const imgSize = isMobile ? 88 : 149

  return (
    <div style={{
      display:       'flex',
      flexDirection: isStacked ? 'column' : 'row',
      gap:           isMobile ? 16 : 20,
      alignItems:    isStacked ? 'stretch' : 'flex-start',
      fontFamily:    font,
    }}>

      <div style={{ flex: isStacked ? undefined : 2, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

        <div style={{
          background:   '#fff',
          borderRadius: 8,
          border:       `1px solid ${COLOR.border}`,
          padding:      isMobile ? '12px 14px' : '16px 20px',
          display:      'flex',
          alignItems:   'center',
          gap:          12,
        }}>
          <Search size={18} color={COLOR.textMuted} style={{ flexShrink: 0 }} />
          <input
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Cari nama produk atau scan barcode"
            style={{
              flex:         1,
              minWidth:     0,
              background:   '#F4F5F7',
              border:       'none',
              outline:      'none',
              borderRadius: 10,
              padding:      '10px 16px',
              fontSize:     13,
              color:        COLOR.text,
              fontFamily:   font,
            }}
          />
          <svg width="22" height="22" viewBox="0 0 24 24" style={{ cursor: 'pointer', flexShrink: 0 }}>
            <rect x="2"  y="3" width="2" height="18" fill={COLOR.amber} />
            <rect x="6"  y="3" width="1" height="18" fill={COLOR.amber} />
            <rect x="9"  y="3" width="2" height="18" fill={COLOR.amber} />
            <rect x="13" y="3" width="1" height="18" fill={COLOR.amber} />
            <rect x="16" y="3" width="2" height="18" fill={COLOR.amber} />
            <rect x="20" y="3" width="2" height="18" fill={COLOR.amber} />
          </svg>
        </div>

        <div style={{
          background:   '#fff',
          borderRadius: 8,
          border:       `1px solid ${COLOR.border}`,
          overflow:     'hidden',
        }}>
          <div style={{
            background: '#FFCD71',
            padding:    isMobile ? '12px 16px' : '14px 20px',
            fontWeight: 600,
            fontSize:   14,
            color:      '#000',
            fontFamily: font,
          }}>
            ACTIVE AUDIT SISTEM
          </div>

          <div style={{ padding: isMobile ? '16px 14px' : '24px 20px' }}>
            <div style={{ display: 'flex', gap: isMobile ? 12 : 24 }}>

              <div style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'flex-start',
                gap:            12,
                flexShrink:     0,
              }}>
                <div style={{
                  width:          imgSize,
                  height:         imgSize,
                  background:     '#1A3A0A',
                  borderRadius:   8,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ color: '#FFD700', fontWeight: 900, fontSize: isMobile ? 18 : 28, fontFamily: font }}>GS</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 15, color: '#000', fontFamily: font }}>AKI GS Astra</div>
                  <div style={{ fontSize: isMobile ? 11 : 12, color: COLOR.textMuted, marginTop: 3, fontFamily: font }}>GS Astra MF NS40Z</div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>

                <div style={{ display: 'flex', gap: isMobile ? 8 : 14, marginBottom: isMobile ? 14 : 20 }}>
                  <div style={{
                    flex:         1,
                    minWidth:     0,
                    background:   '#fff',
                    border:       `1px solid ${COLOR.border}`,
                    borderRadius: 8,
                    padding:      isMobile ? '8px 10px' : '10px 14px',
                  }}>
                    <div style={{ fontSize: isMobile ? 10 : 11, color: COLOR.textMuted, marginBottom: isMobile ? 4 : 8, fontFamily: font }}>
                      System Stock
                    </div>
                    <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 500, color: '#000', fontFamily: font }}>
                      {systemStock}
                    </div>
                  </div>

                  <div style={{
                    flex:         1,
                    minWidth:     0,
                    background:   '#fff',
                    border:       '1.5px solid #FFCD71',
                    borderRadius: 8,
                    padding:      isMobile ? '8px 10px' : '10px 14px',
                  }}>
                    <div style={{ fontSize: isMobile ? 10 : 11, color: '#734A00', marginBottom: isMobile ? 4 : 8, fontFamily: font }}>
                      Actual Count
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: isMobile ? 20 : 28, fontWeight: 500, color: '#000', fontFamily: font }}>
                        {actualCount}
                      </span>
                      <span style={{ fontSize: isMobile ? 13 : 18, fontWeight: 500, color: '#734A00', fontFamily: font }}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize:     isMobile ? 11 : 12,
                  fontWeight:   600,
                  color:        '#000',
                  marginBottom: 10,
                  fontFamily:   font,
                }}>
                  QUICK PHYSICAL COUNT
                </div>
                <div style={{ display: 'flex', gap: isMobile ? 8 : 12, marginBottom: 16 }}>
                  {quickAdds.map(amount => (
                    <button
                      key={amount}
                      onClick={() => setActualCount(prev => prev + amount)}
                      style={{
                        flex:         1,
                        height:       isMobile ? 52 : 71,
                        background:   '#fff',
                        border:       `1px solid ${COLOR.border}`,
                        borderRadius: 8,
                        fontSize:     isMobile ? 15 : 20,
                        fontWeight:   500,
                        cursor:       'pointer',
                        fontFamily:   font,
                        color:        '#000',
                      }}
                    >
                      +{amount}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: isMobile ? 8 : 12 }}>
                  <button style={{
                    flex:         1,
                    height:       41,
                    background:   '#FFA500',
                    border:       'none',
                    borderRadius: 8,
                    fontSize:     isMobile ? 12 : 14,
                    fontWeight:   500,
                    color:        '#fff',
                    cursor:       'pointer',
                    fontFamily:   font,
                  }}>
                    Confirm Items Count
                  </button>
                  <button style={{
                    width:          isMobile ? 44 : 52,
                    height:         41,
                    background:     '#fff',
                    border:         `1px solid ${COLOR.border}`,
                    borderRadius:   8,
                    cursor:         'pointer',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                  }}>
                    <X size={15} color={COLOR.textMuted} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        width:         isStacked ? '100%' : 320,
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        gap:           16,
      }}>

        <div style={{
          background:   '#fff',
          borderRadius: 8,
          border:       `1px solid ${COLOR.border}`,
          overflow:     'hidden',
        }}>
          <div style={{
            padding:        isMobile ? '14px 16px' : '16px 20px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            borderBottom:   `1px solid ${COLOR.border}`,
          }}>
            <span style={{ fontWeight: 600, fontSize: 14, fontFamily: font }}>Session Activity</span>
            <div style={{
              background:   '#F4F5F7',
              borderRadius: 8,
              padding:      '4px 12px',
              fontSize:     11,
              fontWeight:   500,
              color:        COLOR.textMuted,
              fontFamily:   font,
            }}>
              {sessionActivities.length} Items
            </div>
          </div>

          {sessionActivities.map((item, i) => (
            <div key={i} style={{
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              padding:      isMobile ? '12px 16px' : '14px 20px',
              borderBottom: i < sessionActivities.length - 1 ? `1px solid ${COLOR.border}` : 'none',
            }}>
              <div style={{
                width:          44,
                height:         44,
                background:     '#FBFBFB',
                borderRadius:   8,
                flexShrink:     0,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}>
                {item.isMatch
                  ? <CheckCircle size={20} color="#CCCCCC" strokeWidth={1.5} />
                  : <AlertTriangle size={18} color="#FF8D28" strokeWidth={1.5} />
                }
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, color: '#000', fontFamily: font }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize:   11,
                  color:      item.isMatch ? COLOR.textMuted : '#B01212',
                  marginTop:  3,
                  fontFamily: font,
                }}>
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background:   '#734A00',
          borderRadius: 8,
          padding:      isMobile ? '16px 16px' : '18px 20px',
          color:        '#fff',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 14, letterSpacing: 1, fontFamily: font }}>
            PROGRESS THIS SESSION
          </div>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'flex-end',
            marginBottom:   14,
          }}>
            <span style={{ fontSize: isMobile ? 32 : 38, fontWeight: 700, lineHeight: 1, fontFamily: font }}>
              {progressPercent}%
            </span>
            <span style={{ fontSize: 11, color: '#fff', fontFamily: font }}>
              {progressCurrent}/{progressTotal} Items
            </span>
          </div>
          <div style={{ height: 8, background: '#FFF7E8', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: progressWidth, background: '#FFA500', borderRadius: 8 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: isStacked ? undefined : 'flex-end' }}>
          <button style={{
            flex:         isStacked ? 1 : undefined,
            padding:      isMobile ? '10px 12px' : '12px 16px',
            background:   '#F4F5F7',
            border:       'none',
            borderRadius: 8,
            fontSize:     isMobile ? 12 : 13,
            fontWeight:   600,
            color:        COLOR.textMuted,
            cursor:       'pointer',
            fontFamily:   font,
            whiteSpace:   'nowrap',
          }}>
            Discard Session
          </button>
          <button style={{
            flex:           isStacked ? 1 : undefined,
            padding:        isMobile ? '10px 12px' : '12px 16px',
            background:     '#FFA500',
            border:         'none',
            borderRadius:   8,
            fontSize:       isMobile ? 12 : 13,
            fontWeight:     500,
            color:          '#fff',
            cursor:         'pointer',
            fontFamily:     font,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            8,
            whiteSpace:     'nowrap',
          }}>
            <CheckCircle size={16} />
            {isMobile ? 'Finish & Sync' : 'Finish & Sync Audit'}
          </button>
        </div>
      </div>
    </div>
  )
}