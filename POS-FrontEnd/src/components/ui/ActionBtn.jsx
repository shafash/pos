import { COLOR } from '../../constants/colors'

/**
 * @param {{ onClick?, icon: LucideIcon, color?: string }} props
*/

export default function ActionBtn({ onClick, icon: Icon, color = COLOR.textMuted }){
    return (
        <button onClick = {onClick} style = {{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color,
            padding: 4,
            display: 'inline-flex',
            alignItems: 'center',
        }}>
            <Icon size={16} />
        </button>
    )
}