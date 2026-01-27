import globalstyes from './globalstyes.json';

export const buttonStyles = {
    primaryBtn: {
        // height: '35px',
        fontSize: globalstyes.fonts.size.medium,
        fontWeight: globalstyes.fonts.weight.large,
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`,
        borderRadius: '20px',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B51C5',
        color: globalstyes.colors.textPrimary
    },
    secondaryBtn: {
        height: '35px',
        fontSize: globalstyes.fonts.size.medium,
        fontWeight: globalstyes.fonts.weight.large,
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`,
        borderRadius: '20px',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DEDEDE',
        color: '#404040'
    },
    tertiaryBtn: {
        height: '35px',
        fontSize: globalstyes.fonts.size.medium,
        fontWeight: globalstyes.fonts.weight.large,
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`,
        borderRadius: '20px',
        border: '1px solid #0B51C5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        color: '#0B51C5'
    },
}