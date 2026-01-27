export const Styles = {
    mainContainer: {
        width: "100%",
        height: "calc(100% - 10px)",
        padding: "0px 15px 10px 0px",
        marginBottom: "10px"
    },
    cardContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        height: "100%",
        width: '100%',
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
    sidebar: {
        width: '180px',
        height: '100vh',
        flexShrink: 0,
        position: 'fixed'
    },
    componentContainer: {
        height: "100%",
        margin: "0px 15px 0px 180px",
    }
}