export const getStyles = (theme) => ({
    mainContainer: {
        width: "100%",
        height: 'calc(100% - 10px)',
        padding: "0px 15px 10px 15px",
        marginBottom: "10px"
    },
    cardContainer: {
        height: "100%",
        width: '100%',
        overflowY: "auto",
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: "#FFFFFF",
        borderRadius: '15px'
    },
    serviceBtn: {
        width: '60px',
        height: '16px',
        borderRadius: '0',
        borderTopLeftRadius: '5px',
        borderBottomRightRadius: '5px',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        cursor: 'default'
    },
    mainHeadingText: {
        fontSize: theme.typography.h2,
        fontWeight: 600
    },
    cardHeadingText: {
        fontSize: '16px',
        fontWeight: 600
    },
    cardDescriptionText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    },
    noRecordsText: {
        fontSize: theme.typography.h6,
        fontWeight: 400
    },
    noRecord: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%',
        textAlign: "center",
        color: '#999',
        marginTop: '50px'
    },
    infoText: {
        fontSize: theme.typography.h4,
        fontWeight: 400,
    }
})