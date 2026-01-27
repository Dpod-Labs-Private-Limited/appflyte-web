export const getStyles = (theme) => ({
    mainContainer: {
        width: "100%",
        height: 'calc(100% - 10px)',
        padding: "0px 15px 10px 15px",
        marginBottom: "10px",
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
    infoText: {
        fontSize: theme.typography.h4,
        fontWeight: 400,
    }
})