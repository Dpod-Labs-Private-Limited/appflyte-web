import globalstyes from './globalstyes.json';

export const tableStyles = {
    tcontainer: {
        borderRadius: 0,
        boxShadow: 'none',
        fontFamily: 'Inter',
        backgroundColor: "#FFFFFF"
    },

    thead: {
        width: '100%',
    },

    trow: {
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: globalstyes.colors.trowHover || '#1E2933',
        },
    },

    sortlabel: {
        '& .MuiTableSortLabel-root': {
            color: globalstyes.colors.textPrimary || '#FFFFFF',
        },
        '& .MuiTableSortLabel-root:hover': {
            color: globalstyes.colors.textPrimary || '#FFFFFF',
        },
        '& .MuiTableSortLabel-icon': {
            color: globalstyes.colors.textPrimary || '#FFFFFF',
        },
        '& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon, & .MuiTableSortLabel-active .MuiTableSortLabel-icon': {
            color: globalstyes.colors.textPrimary || '#FFFFFF',
        },
    },

    thcell: {
        color: globalstyes.colors.textPrimary || '#FFFFFF',
        backgroundColor: globalstyes.colors.headerBackground || '#222C31',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        textAlign: 'left',
        '& .MuiTableSortLabel-root.Mui-active': {
            color: globalstyes.colors.textPrimary || '#FFFFFF',
        },
    },

    theadText: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.5',
        fontFamily: `${globalstyes.fonts.font_family || 'Inter'}, ${globalstyes.fallbackfont.font_family || 'sans-serif'}`,
        color: globalstyes.colors.textPrimary || '#FFFFFF',
    },

    tdcell: {
        color: globalstyes.colors.textSecondary || '#B0BEC5',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
    },

    emptytr: {
        width: '100%',
    },

    emptytdcell: {
        color: globalstyes.colors.textSecondary || '#B0BEC5',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        textAlign: 'center',
        padding: '20px',
    },
};
