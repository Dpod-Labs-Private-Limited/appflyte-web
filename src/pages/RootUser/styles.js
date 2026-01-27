export const getStyles = (theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        width: '100%'
    },
    sidebarContainer: {
        width: '85px',
        height: '100vh',
        flexShrink: 0,
        position: 'fixed'
    },
    sidebar: {
        height: '100vh',
        padding: "0px 10px",
        width: '85px',
        background: '#1F1F1F',
        position: 'fixed',
        top: 0,
        left: 0,
        color: '#ffffff',
    },
    siebarItem: (selectedMenuItem, index) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        padding: '10px',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '10px',
        backgroundColor: selectedMenuItem === index && '#0B51C5',
        borderRadius: '10px',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            marginTop: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            backgroundColor: '#0B51C5',
        }
    }),
    siebarIcon: {
        color: '#ffffff',
        fontWeight: 700,
        height: '18px',
        width: '18px',
        fontSize: theme.typography.h6
    },
    siebarLabelText: {
        color: '#ffffff',
        transition: 'color 0.3s ease',
        fontSize: theme.typography.h6,
        fontWeight: 500
    },
    mainConatainer: {
        marginLeft: '85px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    navContainer: {
        position: 'fixed',
        top: 0,
        left: '85px',
        right: 0,
        height: '75px',
        zIndex: 10
    },
    navbar: {
        top: 0,
        left: '86px',
        right: 0,
        zIndex: 999,
        height: "75px",
        position: 'fixed',
        flexWrap: 'wrap',
        backgroundColor: '#F3F5F7',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        padding: '0px 20px 0px 30px',
    },
    navLeftContent: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
    },
    navRightContent: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
    },
    navbarBrand: {
        height: '37.48px',
        width: '110px',
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    iconButton: {
        width: '18px',
        height: '12px',
        top: '6px',
        left: '3px',
        gap: '0px',
        border: '1.5px 0px 0px 0px',
        opacity: ' 0px',
        color: '#FFFFFF'
    },
    mainComponentContainer: {
        backgroundColor: '#F3F5F7',
        flex: 1,
        overflow: 'auto',
        marginTop: '0',
        marginLeft: '0',
        paddingTop: '75px',
        height: 'calc(100vh - 75px)',
    },
    libraryComponent: (isAutenticated) => ({
        display: 'flex',
        flexDirection: 'column',
        height: isAutenticated ? 'calc(100vh - 75px)' : '100vh',
        backgroundColor: isAutenticated ? '#F5F7FB' : '#ffffff',
        padding: isAutenticated ? '0px 40px 10px 40px' : '',
        width: '100%',
    }),
    nameText: {
        fontSize: '15px',
        fontWeight: 600,
    },
    paratext: {
        fontSize: '14px',
        fontWeight: 400,
    }
})