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
        backgroundColor: "#FFFFFF",
        borderRadius: '15px',
        padding: '20px'
    },
    saveBtn: {
        borderRadius: '20px',
        pointer: 'cursor',
        width: '100px',
        height: '35px',
        backgroundColor: '#0B51C5',
        color: '#FFFFFF'
    },
    cancelBtn: {
        backgroundColor: '#DEDEDE',
        borderRadius: '20px',
        pointer: 'cursor',
        width: '100px',
        height: '35px',
        color: '#404040'
    },
    btnText: {
        fontSize: '15px',
        fontWeight: 600
    },
    paraText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
    },
    errorText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
        color: 'red'
    },
})