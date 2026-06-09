import { Search } from 'include-react'
import { COLOR } from '../../constants/colors'

/**
 * @param {{ placeholder?: string, value?: string, onChange?: Function }} props
*/

export default function SearchBar({ placeholder = 'Cari...', value, onChange }) {
    return (
        <div style = {{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: COLOR.card,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 8,
            padding: '10px 14px',
            flex: 1,
            maxWidth: 380,
        }}>
            <Search size = {16} color = {COLOR.textMuted} />
            <input placeholder = {placeholder} value = {value} onChange = {onChange} style = {{
                border: 'none',
                outline: 'none',
                fontSize: 13,
                color: COLOR.text,
                background: 'transparent',
                width: '100%',
            }}/>
        </div>
    )
}