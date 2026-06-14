import { useState } from 'react'
import { Store, Package, CreditCard, Users, Shield, Bell, Clock, Save, History, MoreVertical } from 'lucide-react'
import { COLOR } from '../constants/colors'
import PrimaryBtn from '../components/ui/PrimaryBtn'

export default function Settings() {
  const [storeInfo, setStoreInfo] = useState({ name: '', phone: '', address: '', branch: '', npwp: '' })
  
  const activityLogs = [
    { id: 1, time: '10:42 WIB', category: 'Inventory', desc: 'Stock adjustment: GS Astra Premium NS60 (+5 units) by Admin' },
    { id: 2, time: '10:42 WIB', category: 'Inventory', desc: 'Stock adjustment: GS Astra Premium NS60 (+5 units) by Admin' },
    { id: 3, time: '10:42 WIB', category: 'Inventory', desc: 'Stock adjustment: GS Astra Premium NS60 (+5 units) by Admin' },
  ]

  const Toggle = ({ active }) => (
    <div style={{
      width: 36, height: 20, borderRadius: 20,
      background: active ? COLOR.amber || '#F59E0B' : '#E5E7EB',
      position: 'relative', cursor: 'pointer', transition: '0.2s'
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: active ? 18 : 2, transition: '0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
      }} />
    </div>
  )

  const SectionTitle = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: COLOR.amber || '#F59E0B', fontWeight: 600 }}>
      <Icon size={18} />
      <span style={{ color: COLOR.text, fontSize: 15 }}>{title}</span>
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${COLOR.border}`, background: '#fff',
    fontSize: 13, fontFamily: 'inherit', color: COLOR.text,
    boxSizing: 'border-box', marginTop: 6
  }

  const cardStyle = {
    background: COLOR.card || '#fff',
    border: `1px solid ${COLOR.border}`,
    borderRadius: 12, padding: 24,
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle icon={Store} title="Store Information" />
            <PrimaryBtn icon={Save}>Save Changes</PrimaryBtn>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Store Name</label>
              <input style={inputStyle} type="text" placeholder="Masukkan nama toko" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Branch Code</label>
              <input style={inputStyle} type="text" placeholder="Contoh: SMR-01" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Phone Number</label>
              <input style={inputStyle} type="text" placeholder="08xx xxxx xxxx" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Tax ID (NPWP)</label>
              <input style={inputStyle} type="text" placeholder="Nomor NPWP" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.textSub }}>Store Address</label>
              <textarea style={{...inputStyle, resize: 'vertical', minHeight: 80}} placeholder="Alamat lengkap toko" />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          <div style={cardStyle}>
            <SectionTitle icon={Package} title="Inventory & Stock" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Low Stock Threshold</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Alert when stock hits below units</div>
                </div>
                <input style={{...inputStyle, width: 60, textAlign: 'center', marginTop: 0}} type="number" defaultValue={5} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Negative Stock Protection</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Prevent sales of out-of-stock items</div>
                </div>
                <Toggle active={true} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>SKU Auto-generation</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Automatic unique ID creation</div>
                </div>
                <Toggle active={true} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Barcode Scanner Integration</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Enable HID/USB scanner support</div>
                </div>
                <Toggle active={true} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <SectionTitle icon={CreditCard} title="Transaction Settings" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Tax Percentage (PPN)</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Global tax applied to all items</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input style={{...inputStyle, width: 60, textAlign: 'center', marginTop: 0}} type="number" defaultValue={11} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Invoice Prefix</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>Starting characters for bills</div>
                </div>
                <input style={{...inputStyle, width: 80, marginTop: 0}} type="text" defaultValue="TRX-" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Auto-print Receipt</div>
                  <div style={{ fontSize: 11, color: COLOR.textSub }}>After transaction success</div>
                </div>
                <Toggle active={false} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          
          <div style={cardStyle}>
            <SectionTitle icon={Users} title="Member & Loyalty" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Point System</span>
              <Toggle active={true} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: COLOR.textSub }}>Point Conversion (per Rp.1000)</label>
              <input style={inputStyle} type="number" defaultValue={10} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: COLOR.textSub }}>Tiers Management</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                <div style={{ padding: '8px 12px', background: '#F9FAFB', borderRadius: 6, fontSize: 12, border: `1px solid ${COLOR.border}` }}>Common (Normal)</div>
                <div style={{ padding: '8px 12px', background: '#FEF3C7', borderRadius: 6, fontSize: 12, border: '1px solid #FDE68A', color: '#92400E', fontWeight: 600 }}>Gold Member</div>
                <div style={{ padding: '8px 12px', background: '#F3F4F6', borderRadius: 6, fontSize: 12, border: `1px solid ${COLOR.border}`, fontWeight: 600 }}>VIP Member</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <SectionTitle icon={Shield} title="Backup & Security" />
            <button style={{ width: '100%', padding: '10px', background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 8, fontWeight: 600, fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 16 }}>
              <Clock size={16} /> Manual Backup Now
            </button>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: COLOR.textSub }}>Auto-Backup Frequency</label>
              <select style={inputStyle}>
                <option>Daily at 12:00 AM</option>
                <option>Weekly on Sunday</option>
                <option>Monthly</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Two-Factor Auth (2FA)</span>
              <Toggle active={false} />
            </div>
          </div>

          <div style={cardStyle}>
            <SectionTitle icon={Bell} title="Alerts" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Low Stock Alerts', 'Daily Sales Summary', 'Stock Mismatch Audit', 'Failed Transaction'].map((alert, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13 }}>{alert}</span>
                  <input type="checkbox" defaultChecked={i < 3} style={{ accentColor: COLOR.amber || '#F59E0B', width: 16, height: 16 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle icon={History} title="Activity Logs" />
            <span style={{ fontSize: 12, color: COLOR.amber || '#F59E0B', cursor: 'pointer', fontWeight: 600 }}>
              View Full History &gt;&gt;
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activityLogs.map((log, index) => (
              <div key={log.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px 0', 
                borderBottom: index !== activityLogs.length - 1 ? `1px solid ${COLOR.border}` : 'none' 
              }}>
                <span style={{ width: '100px', fontSize: 13, fontWeight: 500, color: COLOR.textSub }}>{log.time}</span>
                <span style={{ width: '120px', fontSize: 13, color: '#9CA3AF' }}>{log.category}</span>
                <span style={{ flex: 1, fontSize: 13, color: COLOR.text }}>{log.desc}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLOR.amber || '#F59E0B' }}>
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
