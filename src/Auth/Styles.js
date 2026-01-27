export const getStyles = (theme) => ({
    mainContainer: {
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F5F7FB'
    },
    body: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    signinContainer: {
        width: '390px',
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
    },
    usersigninContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
    },
    signinButton: {
        border: '1px solid #747775',
        borderRadius: '10px',
        padding: '5px 10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    // signinButton: {
    //     display: 'flex',
    //     alignItems: 'center',
    //     marginTop: '20px',
    //     border: '1px solid #747775',
    //     borderRadius: '5px',
    //     padding: '5px 10px 5px 10px',
    //     cursor: 'pointer'
    // },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        padding: '0px 10px 10px 10px'
    },
    paraText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
    },
    btnText: {
        fontSize: theme.typography.h6,
        fontWeight: 400,
    },
    linkText: {
        fontSize: theme.typography.h6,
        fontWeight: 500,
        color: '#0B51C5',
        cursor: 'pointer',
        marginTop: '20px',
        "&:hover": {
            textDecoration: 'underline',
        },
    },
    loginButton: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #0B51C5',
        borderRadius: '5px',
        padding: '5px 10px 5px 10px',
        cursor: 'pointer',
        height: '40px',
        width: '250px',
        backgroundColor: '#0B51C5',
        color: '#FFFFFF',
    },
})