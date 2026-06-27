import { COLOR } from '../../constants/colors'

/**
 * @param {{ value: boolean, onChange: (v: boolean) => void }} props
*/

export default function Toggle({
    value, onChange
}) {
    return (
        <div onClick = { () => onChange(!value)} style = {{
            width: 44,
            height: 24,
            borderRadius: 12,
            cursor: 'pointer',
            background: value ? COLOR.amber : '#D1D5DB',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0,
        }}>
            <div style= {{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 2,
                left: value ? 22 : 2,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}/>
        </div>
    )
}