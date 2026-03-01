

export const getMainStyles = (theme) => ({
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%'
    },
    creditContainer: {
        height: '35px',
        width: '100%',
        backgroundColor: '#FFD760',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    layoutContainer: (showCreditWarning) => ({
        display: 'flex',
        flex: 1,
        marginTop: showCreditWarning ? '35px' : 0,
        height: showCreditWarning ? 'calc(100vh - 35px)' : '100vh',
    }),
    sidebarContainer: (showCreditWarning) => ({
        width: '85px',
        position: 'fixed',
        top: showCreditWarning ? '35px' : '0',
        height: showCreditWarning ? 'calc(100vh - 35px)' : '100vh',
        left: 0,
        borderRight: '1px solid #eee',
        zIndex: 900,
    }),
    rightSection: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginLeft: '85px',
        height: '100%',
    },
    mainNavbar: {
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
    },
    mainContent: {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#F3F5F7'
    },

    addBtn: {
        width: '90px',
        height: '20px',
        angle: '0 deg',
        opacity: '1',
        borderRadius: '20px',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: '500',
        marginLeft: '10px'
    },

    // Cards
    cardHeader: {
        borderRadius: '0',
        boxShadow: 'none',
        fontFamily: 'Inter',
    },
    noRecord: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%',
        textAlign: "center",
        color: '#999'
    },

    // Loadbar
    loadbarContainer: {
        top: '0',
        left: '0',
        width: '100%',
        position: 'fixed',
        zIndex: '9999'
    },

    loadbar: {
        height: 7,
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#007bff'
        }
    },

    // Tabs
    activateTab: {
        '& .MuiTabs-indicator': { backgroundColor: '#0B51C5', height: '2px' },
        '& .Mui-selected': {
            color: '#000000',
            backgroundColor: '#F0F0F0'
        },
    },
    tabs: {
        textTransform: 'capitalize',
        '&.Mui-selected': {
            color: '#000000'
        }
    },

    // Side Drawer
    sideDrawerContainer: {
        width: '530px',
        backgroundColor: "#DEDEDE",
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px',
        overflow: 'auto',
        maxWidth: '530px'
    },

    ameya_icon: {
        width: '24px',
        height: '23px',
        // borderRadius: '50%',
        objectFit: 'cover',
        // margin: '4px',
        backgroundColor: '#DEDEDE',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },

    // Svg Icons:
    svgIcons: {
        height: '30px',
        width: '30px',
        color: '#FFFFFF',
        stroke: "#FFFFFF"
        // fill: "#FFFFFF"
    },

    // Delete Modal
    modalcontainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '50%',
        boxShadow: '24',
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        padding: '40px',
        transform: 'translate(-50%,-50%)'
    },
    mainWarning: {
        fontSize: '25px',
        fontWeight: '700',
        fontFamily: 'Inter',
        color: '#000000',
        paddingLeft: '10px'
    },
    subWarning: {
        fontSize: '16px',
        fontWeight: '500',
        fontFamily: 'Inter',
        color: '#000000',
        paddingLeft: '10px',
        marginTop: '20px'
    },
    confirmButtonGroup: {
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
    },
    confirmDelete: {
        width: '160px',
        height: '35px',
        backgroundColor: 'red',
        color: 'white',
        fontSize: '15px',
        fontWeight: '600',
        fontFamily: 'Inter',
        borderRadius: '5px',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s',
        // '&:hover': {
        //     backgroundColor: globalstyles.colors.btnPrimaryHover,
        //     color: globalstyes.colors.btnPrimaryHoverText,
        //     border: `2px solid ${globalstyes.colors.btnPrimaryHoverBorder}`
        // },
    },
    cancelDelete: {
        width: '160px',
        height: '35px',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '15px',
        fontWeight: '600',
        fontFamily: 'Inter',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '30px',
        transition: 'background-color 0.3s',
        // '&:hover': {
        //     backgroundColor: globalstyes.colors.btnSecondaryHover,
        //     color: globalstyes.colors.btnSecondaryHoverText,
        //     border: `2px solid ${globalstyes.colors.btnSecondaryHoverBorder}`
        // },
    },

})