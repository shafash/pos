import { Package } from 'lucide-react'

/**
 * Komponen gambar produk:
 * - Kalau ada src (foto_url dari API) → tampilkan foto asli
 * - Kalau tidak ada → tampilkan placeholder ikon kotak hijau
 */
export default function ProductImage({ src, alt, width = 36, height = 28 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? 'foto produk'}
        width={width}
        height={height}
        style={{
          width,
          height,
          objectFit:    'contain',
          borderRadius: 4,
          flexShrink:   0,
          background:   '#F9FAFB',
        }}
        onError={(e) => {
          // Kalau gambar gagal load (file dihapus, dll) → fallback ke placeholder
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextSibling.style.display = 'flex'
        }}
      />
    )
  }

  // Placeholder kalau tidak ada foto
  return (
    <div style={{
      width,
      height,
      background:     '#1A3A0A',
      borderRadius:   4,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      flexShrink:     0,
    }}>
      <Package size={Math.min(width, height) * 0.5} color="#FFD700" strokeWidth={1.5} />
    </div>
  )
}