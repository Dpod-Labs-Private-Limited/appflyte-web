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
        padding: '20px 20px 0px 20px'

    },
    paraText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
    },
    mainHeadingText: {
        fontSize: theme.typography.h4,
        fontWeight: 600
    },
    uploadBtn: {
        backgroundColor: '#0B51C5',
        color: '#FFFFFF',
        borderRadius: '20px',
        width: '150px',
        height: '40px'
    },
    btnText: {
        fontSize: "14px",
        fontWeight: 600,
        textTransform: 'none'
    },
    reviewBtn: {
        backgroundColor: '#FFFFFFF',
        color: '#0B51C5',
        borderRadius: '5px',
        width: '100px',
        height: '25px',
        textTransform: 'none'
    },
    approveBtn: {
        backgroundColor: '#FFFFFFF',
        border: '1px solid #25B93F',
        color: '#25B93F',
        borderRadius: '5px',
        width: '85px',
        height: '25px',
        textTransform: 'none'
    },
    chatbotBtn: {
        width: 50,
        height: 50,
        minWidth: 50,
        borderRadius: "50%",
        boxShadow: "0 16px 32px rgba(0,0,0,0.35)",
        background: "#DFDFDF",
        color: "#000000",
        fontSize: 18,
        fontWeight: 700,
        textTransform: "none",
        transition: "all .25s ease",
        "&:hover": {
            transform: "translateY(-3px) scale(1.05)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.35)",
            background: "#DFDFDF",
        }
    }
})