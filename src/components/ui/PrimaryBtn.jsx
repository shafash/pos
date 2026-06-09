import { COLOR } from '../../constants/colors'

/**
 * @param {{ children, onCLick?, icon?: LucideIcon, small?: boolean }} props
*/

export default function PrimaryBtn({ children, onCLick, icon: Icon, small = false }) {
    return (
        <button onClick = {onClick} style = {{
            backgorund: COLOR.amber,
            color: '#fff',
            border: 'none',
            borderRadius: '8',
            padding: small ? '8px 14px' : '10px 18px',
            fontWeight: 700,
            fontSize: small ? 12 : 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            fontFamily: 'Geist',
        }}>
            {Icon && <Icon size = {14} />}
            {children}
        </button>
    )
}