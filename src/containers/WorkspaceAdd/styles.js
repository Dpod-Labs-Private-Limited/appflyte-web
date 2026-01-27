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
    card: {
        height: '100%',
        cursor: 'pointer',
        borderRadius: '20px',
        padding: '15px',
        backgroundColor: '#F3F5F7',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F5F7',
        padding: '10px 20px 10px 20px',
        color: theme.palette.text.primary,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    cardBody: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        padding: '0px 20px 10px 20px',
        backgroundColor: '#F3F5F7',
        color: theme.palette.text.primary,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    mainHeadingText: {
        fontSize: theme.typography.h2,
        fontWeight: 600
    },
    btnText: {
        fontSize: theme.typography.h6,
        fontWeight: 600,
        textTransform: 'none'
    },
    cardHeadingText: {
        fontSize: theme.typography.h6,
        fontWeight: 600
    },
    cardDescriptionText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    },
    errorText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
        color: 'red'
    },
    noRecordsText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    }
});