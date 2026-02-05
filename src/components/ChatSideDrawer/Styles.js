import globalstyes from "../../utils/globalStyles";

export const Styles = {
    // Chat Drawer
    chatBoxOuterContainer: {
        display: 'flex',
        flex: 1,
        height: '100%',
        width: '100%',
        flexGrow: 1,
        overflow: 'auto',
        backgroundColor: '#DEDEDE'
    },
    chatBoxLoadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: '100%',
        width: '100%',
        flexGrow: 1,
        overflow: 'auto',
        backgroundColor: '#DEDEDE'
    },
    chatBoxInnerContainer: {
        width: '100%',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingBottom: '0px'
    },
    chatFeedBackContainer: {
        padding: '15px',
        paddingTop: '0px',
        display: 'flex',
        justifyContent: 'end',
        flexDirection: 'row',
        flex: 1
    },
    chatBoxMessageContainer: {
        padding: '12px 15px',
        borderRadius: '10px',
        maxWidth: '100%',
        wordWrap: 'break-word',
        display: 'flex',
        alignSelf: 'flex-start',
        margin: '0px 0px 15px 20px',
        width: '100%',
        color: '#000',
        backgroundColor: '#FFFFFF'
    },
    chatMessages: {
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    chatInputContainer: {
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#DEDEDE',
        zIndex: 10,
        padding: '10px',
        display: 'flex'
    },
    chatFeedbackbtn: {
        height: '35px',
        fontSize: globalstyes.fonts.size.medium,
        fontWeight: globalstyes.fonts.weight.large,
        borderRadius: '20px',
        border: '2px solid #0B51C5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalstyes.colors.textPrimary,
        color: '#0B51C5',
        '&:hover': {
            backgroundColor: '#0B51C5',
            color: globalstyes.colors.textPrimary,
            border: `2px solid ${globalstyes.colors.textPrimary}`
        }
    }

}
