/**
 * @param {{ width: number, height ?: number }} props
*/

export default function ProductImage({
    width = 80, height = 60
}) {
    return (
        <div style = {{
            width,
            height,
            background: '#2D5016',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            <img src = "/gs.png" alt = "product" style = {{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
            }}></img>
        </div>
    )
}