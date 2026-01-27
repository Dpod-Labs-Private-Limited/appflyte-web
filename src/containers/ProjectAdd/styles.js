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
    card: {
        height: '100%',
        cursor: 'pointer',
        borderRadius: '20px',
        padding: '10px',
        backgroundColor: '#F3F5F7'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F5F7',
        padding: '10px 20px 10px 20px',
        color: '#000000',
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
        color: '#000000',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    aiEngineCard: {
        height: '100%',
        cursor: 'pointer',
        borderRadius: '5px',
        padding: '8px',
        backgroundColor: '#FFFFFF'
    },
    aiEngineCardHeader: {
        padding: '10px',
        color: '#000000',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    aiEngineCardBody: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        padding: '0px 10px 10px 10px',
        color: '#000000',
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
    subHeadingText: {
        fontSize: theme.typography.h4,
        fontWeight: 600
    },
    noRecordsText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    }
})