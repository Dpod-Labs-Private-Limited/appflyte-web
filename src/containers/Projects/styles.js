export const getStyles = (theme) => ({
    mainContainer: {
        width: "100%",
        height: 'calc(100% - 10px)',
        padding: "0px 15px 10px 15px",
        marginBottom: "10px"
    },
    cardContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        height: "100%",
        overflowY: "auto",
    },
    linkText: {
        fontSize: theme.typography.h2,
        fontWeight: 400,
        color: 'black'
    },
    mainHeadingText: {
        fontSize: theme.typography.h2,
        fontWeight: 600,
        color: 'black'
    },
    btnText: {
        fontSize: theme.typography.h6,
        fontWeight: 600,
        textTransform: 'none',
    },
    errorText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
        color: 'red'
    },
    noRecordsText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    },
    addBtn: {
        fontFamily: 'Inter',
        borderRadius: '20px',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B51C5',
        color: "#FFFFFF",
        width: '110px'
    },
    btnText: {
        fontSize: theme.typography.h6,
        fontWeight: 600,
        textTransform: 'none'
    },
    projectCardContainer: {
        marginTop: '50px',
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(12, 1fr)',
    },
    projectCard: {
        all: 'unset',
        bgcolor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #DEDEDE',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        cursor: 'pointer',
        gridColumn: 'span 12',
        '@media (min-width: 600px)': {
            gridColumn: 'span 6',
        },
        '@media (min-width: 900px)': {
            gridColumn: 'span 4',
        }
    },
    projectHeadingText: {
        fontSize: theme.typography.h6,
        fontWeight: 600,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
    },
    projectDescriptionText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
        width: '100%',
    },
})