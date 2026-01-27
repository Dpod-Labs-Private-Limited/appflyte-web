export const getStyles = (theme) => ({
    mainContainer: {
        width: "100%",
        height: 'calc(100% - 10px)',
        padding: "0px 15px 10px 15px",
        marginBottom: "10px"
    },
    cardContainer: {
        backgroundColor: theme.palette.background.default,
        borderRadius: "20px",
        height: "100%",
        overflowY: "auto",
    },
    mainHeadingText: {
        fontSize: theme.typography.h2,
        fontWeight: 600
    },
    orgCardContainer: {
        marginTop: '50px',
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(12, 1fr)',
    },
    orgCard: {
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
    orgHeadingText: {
        fontSize: theme.typography.h6,
        fontWeight: 600,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
    },
    orgDescriptionText: {
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
    noRecordsText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    }
});