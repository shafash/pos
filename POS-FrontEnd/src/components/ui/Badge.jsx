import { COLOR } from '../../constants/colors'

const styles = {
    amber: { bg: COLOR.amberLight, text: COLOR.amberDark },
    red: { bg: COLOR.redlight, text: COLOR.red },
    green: { bg: COLOR.greenLight, text: COLOR.green },
    gray: { bg: '#F3F4F6', text: '#6B7280' },
}

/**
 * @param {{ children: React.ReactNode, color?: 'amber'|'red'|'green'|'gray' }} props
*/

export default function Badge ({ children, color = 'amber' }) {
    const s = styles[color] ?? styles.gray
    return (
        <span style={{
            background: s.bg,
            color: s.text,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 99,
            whiteSpace: 'nowrap',
            display: 'inline-block',
        }}>
            {children}
        </span>
    )
}