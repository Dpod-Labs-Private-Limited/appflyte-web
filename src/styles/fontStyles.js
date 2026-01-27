import globalstyes from './globalstyes.json';
import theme from './theme';

export const fontStyles = {

    paragraphText: {
        fontSize: theme.typography.h6.fontSize,
        fontWeight: '400px'
    },
    mainHeadingText: {
        fontSize: theme.typography.h6.fontSize,
        fontWeight: 600,
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },
    primaryText: {
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },
    btnText: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'none',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },
    btnSmallText: {
        fontSize: '13px',
        fontWeight: '500',
        textTransform: 'none',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },
    smallText: {
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },

    mediumText: {
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },

    largeText: {
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    },

    formErrorText: {
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`,
        color: 'red'
    },

    drawerHeading: {
        fontSize: '17px',
        fontWeight: '700',
        lineHeight: '30px',
        fontFamily: `${globalstyes.fonts.font_family}, ${globalstyes.fallbackfont.font_family}`
    }


}