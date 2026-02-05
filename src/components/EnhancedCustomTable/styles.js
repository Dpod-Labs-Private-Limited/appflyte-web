const styles = {
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
        cursor: 'pointer'
    },

    sortlabel: {
        '& .MuiTableSortLabel-root': {
            color: '#FFFFFF',
        },
        '& .MuiTableSortLabel-root:hover': {
            color: '#FFFFFF',
        },
        '& .MuiTableSortLabel-icon': {
            color: '#FFFFFF',
        },
        '& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon, & .MuiTableSortLabel-active .MuiTableSortLabel-icon': {
            color: '#FFFFFF',
        },
    },

    thcell: {
        color: '#FFFFFF',
        backgroundColor: '#222C31',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 500,
        paddingTop: '3px',
        paddingBottom: '3px',
        paddingLeft: '16px',
        paddingRight: '16px',
        textAlign: 'left',
        '& .MuiTableSortLabel-root.Mui-active': {
            color: '#FFFFFF',
        },
    },

    theadText: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.5',
        fontFamily: 'Inter',
        color: '#FFFFFF',
    },

    tdcell: {
        color: '#B0BEC5',
        fontFamily: 'Inter',
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
        color: '#B0BEC5',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 400,
        textAlign: 'center',
        padding: '20px',
    },
};

export default function getStyles() {
    return styles;
}