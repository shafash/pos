import { COLOR, FONT } from '../../constants/colors'

export default function Topbae({ title, sidebarWidth }) {
    return (
        <div style = {{
            position: 'fixed',
            top: 0,
            left: sidebarWidth,
            right: 0,
            height: 56,
            background:'#FFFFFF',
            borderBottom: `1px solid ${COLOR.border}`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 32,
            zIndex: 9,
        }}>
            <h1 style = {{
                fontSize: 18,
                fontWeight: 500,
                color: COLOR.text,
                fontFamily: FONT.heading,
                margin: 0,
            }}>
                {title}
            </h1>
        </div>
    )
}