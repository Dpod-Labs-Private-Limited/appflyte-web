const getStyles = () => ({
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
        padding: '20px'
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
    },
    viewCardContainer: {
        marginTop: '50px',
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(12, 1fr)',
    },
    card: {
        all: 'unset',
        bgcolor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #DEDEDE',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        padding: '20px',
        cursor: 'pointer',
        gridColumn: 'span 12',
        '@media (min-width: 600px)': {
            gridColumn: 'span 6',
        },
        '@media (min-width: 900px)': {
            gridColumn: 'span 4',
        }
    },
    launchButton: {
        backgroundColor: '#0B51C5',
        textTransform: 'none',
        fontSize: 13,
        '&:hover': { backgroundColor: '#0842a0' },
        width: '100px'
    }

})
export default getStyles;