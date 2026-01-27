export const getStyles = (theme) => ({
    sidebar: {
        height: '100vh',
        padding: "0px 10px",
        width: '180px',
        background: '#F3F5F7',
        position: 'fixed',
        color: theme.palette.text.main,
        marginTop: '10px'
    },
    siebarItem: (selectedMenuItem, index) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px',
        cursor: 'pointer',
        marginBottom: '10px',
        backgroundColor: selectedMenuItem === index && '#DEDEDE',
        borderRadius: '20px',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            marginBottom: '10px',
            borderRadius: '20px',
            backgroundColor: '#DEDEDE',
        }
    }),
    siebarIcon: {
        color: '#000000',
        marginRight: '10px',
        fontWeight: 700,
        height: '18px',
        width: '18px',
        fontSize: theme.typography.h6
    },
    siebarLabelText: {
        color: '#000000',
        transition: 'color 0.3s ease',
        fontSize: '13px',
        fontWeight: 500
    }
})