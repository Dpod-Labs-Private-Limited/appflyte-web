export const getStyles = (theme) => ({
    mainContainer: {
        width: "100%",
        height: "100%",
        padding: "0 15px 15px 15px",
        boxSizing: "border-box",
        overflow: "hidden",
    },
    cardContainer: {
        backgroundColor: theme.palette.background.default,
        borderRadius: "20px",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
    }
});
