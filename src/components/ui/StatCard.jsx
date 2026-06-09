import { COLOR } from '../../constants/colors'

/**
 * @param {{label: string, value: string, sub?: string }} props
*/

export default function StatCard({ label, value, sub }) {
    return (
        <div style = {{
            background: COLOR.card,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: '20px 24px',
            flex: 1,
            minWidth: 160,
        }}>
            <div style = {{
                fontSize: 13,
                color: COLOR.textSub,
                marginBottom: 6,
            }}>
                {label}
            </div>
            <div style = {{
                fontSize: 28,
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