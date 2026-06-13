import { useState }  from 'react'
import {
  Package, FileText, Users, Shield,
  Bell, Pencil, Database, Check,
} from 'lucide-react'
import { COLOR }      from '../constants/colors'
import PrimaryBtn     from '../components/ui/PrimaryBtn'
import Toggle         from '../components/shared/Toggle'

function Section({ icon: Icon, title, children }) {
  return (
    <div style={{
      background:   COLOR.card,
      border:       `1px solid ${COLOR.border}`,
      borderRadius: 12,
      padding:      24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Icon size={16} color={COLOR.amber} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange, last }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '12px 0',
      borderBottom:   last ? 'none' : `1px solid ${COLOR.border}`,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

export default function Settings() {
  const [toggles, setToggles] = useState({
    negative:  true,
    sku:       true,
    barcode:   true,
    point:     true,
    twofa:     false,
    autoprint: false,
  })

  const set = (key) => (val) => setToggles(t => ({ ...t, [key]: val }))

  const inputStyle = {
    width:        '100%',
    padding:      '10px 12px',
    border:       `1px solid ${COLOR.border}`,
    borderRadius: 8,
    fontSize:     13,
    outline:      'none',
    fontFamily:   'inherit',
    boxSizing:    'border-box',
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: COLOR.text, marginBottom: 20 }}>
        Settings
      </h1>

      <div style={{
        background:   COLOR.card,
        border:       `1px solid ${COLOR.border}`,
        borderRadius: 12,
        padding:      24,
        marginBottom: 20,
      }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={18} color={COLOR.amber} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Store Information</span>
          </div>
          <PrimaryBtn>Save Changes</PrimaryBtn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {['Store Name', 'Branch Code', 'Phone Number', 'Tax ID (NPWP)'].map(label => (
            <div key={label}>
              <div style={{ fontSize: 12, color: COLOR.textSub, marginBottom: 6 }}>{label}</div>
              <input style={inputStyle} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 12, color: COLOR.textSub, marginBottom: 6 }}>Store Address</div>
            <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        <Section icon={Package} title="Inventory & Stock">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLOR.border}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Low Stock Threshold</div>
              <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 2 }}>Alert when stock falls below units</div>
            </div>
            <input
              type="number"
              defaultValue={5}
              style={{
                width: 60, padding: '6px 10px',
                border: `1px solid ${COLOR.border}`,
                borderRadius: 6, fontSize: 13,
                textAlign: 'center', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <ToggleRow label="Negative Stock Protection" sub="Prevent sales of out-of-stock items" value={toggles.negative} onChange={set('negative')} />
          <ToggleRow label="SKU Auto-generation"       sub="Automate unique ID creation"         value={toggles.sku}      onChange={set('sku')}      />
          <ToggleRow label="Barcode Scanner Integration" sub="Enable HID/USB scanner support"    value={toggles.barcode}  onChange={set('barcode')}  last />
        </Section>

        <Section icon={FileText} title="Transaction Settings">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLOR.border}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Tax Percentage (PPN)</div>
              <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 2 }}>Global tax applied to all items</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="number" defaultValue={11} style={{ width: 60, padding: '6px 10px', border: `1px solid ${COLOR.border}`, borderRadius: 6, fontSize: 13, textAlign: 'center', outline: 'none', fontFamily: 'inherit' }} />
              <span style={{ fontSize: 12, color: COLOR.textMuted }}>%</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLOR.border}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Invoice Prefix</div>
              <div style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 2 }}>Starting characters for bills</div>
            </div>
            <input type="text" defaultValue="TRX -" style={{ width: 80, padding: '6px 10px', border: `1px solid ${COLOR.border}`, borderRadius: 6, fontSize: 13, textAlign: 'center', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ padding: '12px 0', borderBottom: `1px solid ${COLOR.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Accepted Payment Methods</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Cash', 'QRIS'].map(m => (
                <div key={m} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 12px',
                  border: `1px solid ${COLOR.border}`,
                  borderRadius: 20, fontSize: 12,
                }}>
                  <Check size={12} color={COLOR.green} /> {m}
                </div>
              ))}
              <button style={{ padding: '4px 12px', border: `1px dashed ${COLOR.border}`, borderRadius: 20, background: 'none', fontSize: 12, cursor: 'pointer', color: COLOR.textSub, fontFamily: 'inherit' }}>
                Add +
              </button>
            </div>
          </div>
          <ToggleRow label="Auto-print Receipt" sub="After transaction success" value={toggles.autoprint} onChange={set('autoprint')} last />
        </Section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

        <Section icon={Users} title="Member & Loyalty">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Point System</span>
            <Toggle value={toggles.point} onChange={set('point')} />
          </div>
          <div style={{ fontSize: 12, color: COLOR.textMuted, marginBottom: 4 }}>
            Point Conversion (per Rp.1000)
          </div>
          <input
            type="number"
            defaultValue={10}
            style={{
              width:        '100%',
              padding:      '6px 0',
              border:       'none',
              borderBottom: `1px solid ${COLOR.border}`,
              fontSize:     13,
              outline:      'none',
              marginBottom: 16,
              fontFamily:   'inherit',
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Tiers Management</div>
          {['Ecerean (Normal)', 'Gold Member', 'VIP Member'].map((tier, i) => (
            <div key={tier} style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '9px 0',
              borderBottom:   i < 2 ? `1px solid ${COLOR.border}` : 'none',
            }}>
              <span style={{
                fontSize:   13,
                color:      i === 1 ? COLOR.amber : COLOR.text,
                fontWeight: i === 1 ? 600 : 400,
              }}>
                {tier}
              </span>
              <Pencil size={14} color={COLOR.textMuted} style={{ cursor: 'pointer' }} />
            </div>
          ))}
        </Section>

        <Section icon={Shield} title="Backup & Security">
          <button style={{
            width:          '100%',
            padding:        14,
            background:     COLOR.amberLight,
            border:         `1px solid ${COLOR.amber}`,
            borderRadius:   10,
            fontSize:       13,
            fontWeight:     700,
            cursor:         'pointer',
            color:          COLOR.amberDark,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            8,
            marginBottom:   16,
            fontFamily:     'inherit',
          }}>
            <Database size={16} /> Manual Backup Now
          </button>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Auto-Backup Frequency
          </div>
          <select style={{
            width:        '100%',
            padding:      '10px 12px',
            border:       `1px solid ${COLOR.border}`,
            borderRadius: 8,
            fontSize:     13,
            outline:      'none',
            marginBottom: 16,
            background:   '#fff',
            fontFamily:   'inherit',
          }}>
            <option>Daily at 12:00 AM</option>
            <option>Weekly on Monday</option>
            <option>Monthly</option>
          </select>
          <ToggleRow label="Two-Factor Auth (2FA)" value={toggles.twofa} onChange={set('twofa')} last />
        </Section>

        <Section icon={Bell} title="Alerts">
          {[
            { label: 'Low Stock Alerts',      active: true  },
            { label: 'Daily Sales Summary',   active: true  },
            { label: 'Stock MisMatch Audit',  active: false },
            { label: 'Failed Transaction',    active: true  },
          ].map((alert, i, arr) => (
            <div key={alert.label} style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '10px 0',
              borderBottom:   i < arr.length - 1 ? `1px solid ${COLOR.border}` : 'none',
            }}>
              <span style={{ fontSize: 13 }}>{alert.label}</span>
              <Check size={14} color={alert.active ? COLOR.amber : COLOR.textMuted} />
            </div>
          ))}
        </Section>
      </div>
    </div>
  )
}
