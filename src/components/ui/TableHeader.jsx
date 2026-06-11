import { COLOR } from '../../constants/colors'

/**
 * @param {{ cols: string[] }} props
*/

export default function TableHeader({ cols }) {
    return (
        <thead>
            <tr>
                {cols.map((col, i) => (
                    <th key = {i} style = {{
                        background: COLOR.tableHeader,
                        color: COLOR.tableHeaderText,
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        borderRadius: 
                            i === 0 
                                ? '8px 0 0 8px'
                                : i === cols.length - 1
                                ? '0 8px 8px 0'
                                : 0,
                    }}>
                        {col}
                    </th>
                ))}
            </tr>
        </thead>
    )
}