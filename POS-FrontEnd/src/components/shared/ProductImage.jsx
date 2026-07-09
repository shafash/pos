/**
 * @param {{ width: number, height?: number, src?: string, alt?: string }} props
 */

export default function ProductImage({
    width = 80, height = 60, src, alt = 'product'
}) {
    return (
        <div style={{
            width,
            height,
            background: '#2D5016',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
        }}>
            <img
                src={src || '/gs.png'}
                alt={alt}
                onError={(e) => { e.currentTarget.src = '/gs.png' }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />
        </div>
    )
}