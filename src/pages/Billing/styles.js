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
    mainHeadingText: {
        fontSize: '16px',
        fontWeight: 600,
        color: 'black'
    },
    paraText: {
        fontSize: '14px',
        fontWeight: 400,
        color: 'black'
    },
    creditText: {
        fontSize: '24px',
        fontWeight: 700,
        color: 'black'
    },
    creditBtn: {
        height: '30px',
        width: '180px',
        border: '1px solid #0B51C5',
        borderRadius: '5px'
    },
    creditBtnText: {
        fontSize: '14px',
        fontWeight: '400',
        color: '#0B51C5',
        textTransform: 'none'
    },
    continueBtn: {
        height: '40px',
        width: '100px',
        backgroundColor: '#0B51C5',
        borderRadius: '20px'
    },
    continueBtnText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'none'
    },
    wrapper: {
        position: "relative",
        display: "flex",
        width: "220px",
        background: "#e5e7eb",
        borderRadius: "999px",
        padding: "2px",          
        height: "32px",         
    },
    slider: {
        position: "absolute",
        top: 2,
        left: 2,
        width: "calc(50% - 2px)",
        height: "calc(100% - 4px)",
        background: "#2563eb",
        borderRadius: "999px",
        transition: "0.25s ease",
    },
    button: {
        flex: 1,
        background: "transparent",
        border: "none",
        zIndex: 1,
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
    }
})