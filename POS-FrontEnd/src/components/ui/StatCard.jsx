import { COLOR } from '../../constants/colors'

/**
 * @param {{label: string, value: string, sub?: string, compact?: boolean }} props
*/

export default function StatCard({ label, value, sub, compact = false }) {
    return (
        <div style = {{
            background: COLOR.card,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: compact ? '14px 16px' : '20px 24px',
            flex: 1,
            minWidth: 0,
            boxSizing: 'border-box',
        }}>
            <div style = {{
                fontSize: compact ? 12 : 13,
                color: COLOR.textSub,
                marginBottom: compact ? 4 : 6,
                whiteSpace: 'nowrap',
            }}>
                {label}
            </div>
            <div style = {{
                fontSize: compact ? 20 : 28,
                fontWeight: 800,
                color: COLOR.text,
                letterSpacing: -1,
            }}>
                {value}
            </div>
            {sub && (
                <div style = {{
                    fontSize: 12, 
                    color: COLOR.textMuted,
                    marginTop: 4,
                }}>
                    {sub}
                </div>
            )}
        </div>
    )
}