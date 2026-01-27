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
        fontSize: theme.typography.h4,
        fontWeight: 600,
        color: 'black'
    },
    btnText: {
        fontSize: theme.typography.h6,
        fontWeight: 600,
        textTransform: 'none'
    },
    paraText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
    },
    linkText: {
        fontSize: theme.typography.h4,
        fontWeight: 400
    },
})