import { COLOR } from '../../constants/colors'

/**
 * @param {{ children, onCLick?, icon?: LucideIcon, small?: boolean, style?: object }} props
*/

export default function PrimaryBtn({ children, onClick, icon: Icon, small = false, style = {} }) {
    return (
        <button onClick = {onClick} style = {{
            background: COLOR.amber,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: small ? '8px 14px' : '10px 18px',
            fontWeight: 700,
            fontSize: small ? 12 : 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            fontFamily: 'Geist',
            boxSizing: 'border-box',
            ...style,
        }}>
            {Icon && <Icon size = {14} />}
            {children}
        </button>
    )
}