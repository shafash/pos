import { Menu } from 'lucide-react'
import { COLOR, FONT } from '../../constants/colors'
import { useIsMobile } from '../../hooks/useIsMobile'

/**
 * @param {{ title: string, sidebarWidth: number, onOpenMobile: () => void }} props
 */
export default function Topbar({ title, sidebarWidth, onOpenMobile }) {
  const isMobile = useIsMobile()

  return (
    <div style={{
      position:     'fixed',
      top:          0,
      left:         isMobile ? 0 : sidebarWidth,
      right:        0,
      height:       56,
      background:   '#FFFFFF',
      borderBottom: `1px solid ${COLOR.border}`,
      display:      'flex',
      alignItems:   'center',
      gap:          12,
      paddingLeft:  isMobile ? 16 : 32,
      zIndex:       9,
      transition:   'left 0.2s',
    }}>
      {isMobile && (
        <Menu
          size={20}
          color={COLOR.text}
          onClick={onOpenMobile}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        />
      )}
      <h1 style={{
        fontSize:   18,
        fontWeight: 500,
        color:      COLOR.text,
        fontFamily: FONT.heading,
        margin:     0,
      }}>
        {title}
      </h1>
    </div>
  )
}