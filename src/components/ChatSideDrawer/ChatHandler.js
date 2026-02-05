import React, { useState, useEffect } from 'react';
import { Styles } from './Styles';
import { ReactSVG } from "react-svg";
import { mainStyles } from '../../styles/styles';
import { fontStyles } from '../../styles/fontStyles';
import { IconSvg } from '../../utils/globalIcons';
import { getUserInitials } from '../../utils/GetAccountDetails';
import { SendOutlined, ThumbDownAlt, ThumbsUpDownSharp, ThumbUpAlt, ThumbUpSharp } from '@mui/icons-material';
import { Box, TextField, Typography, SwipeableDrawer, IconButton, InputAdornment, Avatar, Button, CircularProgress, } from '@mui/material';
import { buttonStyles } from '../../styles/buttonStyles';

function ChatHandler({ chatdrawer, toggleDrawer, chatWindowRef, setChatInput, chatInput,
    disableChat, qmsChatData, handleQmsChat, qmsSystemResponse, chatMessageLoading }) {

    const [loaderDots, setLoaderDots] = useState("");

    useEffect(() => {
        let interval;
        if (chatMessageLoading) {
            interval = setInterval(() => {
                setLoaderDots((prev) => {
                    if (prev === ".........") return "";
                    return prev + ".";
                });
            }, 500);
        } else {
            setLoaderDots("");
        }
        return () => clearInterval(interval);
    }, [chatMessageLoading]);

    let skipNext = false;
    return (
        <SwipeableDrawer
            anchor='right'
            open={chatdrawer.state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            sx={{
                height: '100vh',
            }}
        >
            <Box sx={mainStyles.sideDrawerContainer}>

                <Typography style={fontStyles.drawerHeading}>Train AI QMS Agent</Typography>

                {!chatMessageLoading && qmsChatData.length === 0 && (
                    <Box sx={Styles.chatBoxLoadingContainer}>
                        No Preview Available
                    </Box>
                )}

                {qmsChatData?.length === 0 && chatMessageLoading ?
                    (<Box sx={Styles.chatBoxLoadingContainer}>
                        <CircularProgress />
                    </Box>) :
                    (<Box sx={Styles.chatBoxOuterContainer}>
                        <Box ref={chatWindowRef} sx={Styles.chatBoxInnerContainer}>

                            {qmsChatData?.map((msg, index) => {
                                if (skipNext) {
                                    skipNext = false;
                                    return null;
                                }

                                if (msg.blockUserTextInput) {
                                    skipNext = true;
                                }

                                return (
                                    <Box key={index}>
                                        {<Box display={'flex'} width={'100%'}>

                                            {msg?.sender === 'user' &&
                                                <Box width={'20px'} marginTop={'5px'}>
                                                    <Avatar sx={{ bgcolor: '#000000', height: '32px', width: '32px' }}>
                                                        <Typography sx={fontStyles.mediumText}>{getUserInitials()}</Typography>
                                                    </Avatar>
                                                </Box>}

                                            {msg?.sender === 'system' &&
                                                <Box width={'20px'} marginTop={'5px'}>
                                                    <Box sx={mainStyles.ameya_icon}>
                                                    </Box>
                                                </Box>
                                            }

                                            <Box
                                                sx={Styles.chatBoxMessageContainer}
                                            >
                                                <Typography
                                                    sx={{
                                                        ...fontStyles.smallText,
                                                        ...Styles.chatMessages
                                                    }}
                                                >
                                                    {msg.chat}
                                                </Typography>
                                            </Box>

                                        </Box>}
                                    </Box>)
                            })}

                            {qmsChatData?.length > 0 && !chatMessageLoading && qmsSystemResponse?.nextUserActionType === "feedback_thumps_up" && !disableChat &&
                                <Box sx={Styles.chatFeedBackContainer}>
                                    < Box >
                                        <IconButton
                                            sx={{
                                                backgroundColor: '#0B51C5',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#0B51C5',
                                                },
                                                '&:active': {
                                                    backgroundColor: 'white',
                                                    color: '#0B51C5',
                                                },
                                            }}
                                            onClick={() => handleQmsChat('feedback_thumps_up', true, 'thumbs_up')}
                                        >
                                            <ThumbUpAlt />
                                        </IconButton>
                                        <IconButton
                                            sx={{
                                                backgroundColor: '#0B51C5',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#0B51C5',
                                                },
                                                '&:active': {
                                                    backgroundColor: 'white',
                                                    color: '#0B51C5',
                                                },
                                                marginLeft: '10px'
                                            }}
                                            onClick={() => handleQmsChat('feedback_thumps_up', true, 'thumbs_down')}
                                        >
                                            <ThumbDownAlt />
                                        </IconButton>
                                    </Box>
                                </Box>
                            }

                            {qmsChatData?.length > 0 && !chatMessageLoading && qmsSystemResponse.nextUserActionType === "feedback_options" && !disableChat &&
                                <Box sx={Styles.chatFeedBackContainer}>

                                    < Box display={'flex'}>
                                        <Button
                                            sx={{ ...Styles.chatFeedbackbtn }}
                                            onClick={() => handleQmsChat('feedback_options', true, 'continue')}
                                        >
                                            <Typography sx={{ ...fontStyles.smallText, textTransform: 'capitalize' }}>Continue</Typography>
                                        </Button>
                                        <Button
                                            sx={{ ...Styles.chatFeedbackbtn, marginLeft: '10px' }}
                                            onClick={() => handleQmsChat('feedback_options', true, 'startfresh')}
                                        >
                                            <Typography sx={{ ...fontStyles.smallText, textTransform: 'capitalize' }}>Start Fresh</Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            }
                        </Box>
                    </Box>)
                }

                {qmsChatData?.length > 0 &&
                    (<Box sx={Styles.chatInputContainer}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={chatMessageLoading ? `${loaderDots}` : chatInput}
                            placeholder={chatMessageLoading ? "" : "Type your message..."}
                            disabled={qmsSystemResponse?.blockUserTextInput || disableChat ||
                                qmsSystemResponse.nextUserActionType === 'feedback_option' || qmsSystemResponse.nextUserActionType === 'feed_backthumsup'}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && chatInput.trim()) {
                                    handleQmsChat(chatInput, false, 'text');
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {chatMessageLoading === false ?
                                            (<IconButton
                                                color="primary"
                                                onClick={() => handleQmsChat(chatInput, false, 'text')}
                                                disabled={!chatInput.trim() || disableChat || qmsSystemResponse?.blockUserTextInput ||
                                                    qmsSystemResponse.nextUserActionType === "feedback_option" || qmsSystemResponse.nextUserActionType === 'feed_backthumsup'}
                                            >
                                                <SendOutlined />
                                            </IconButton>
                                            ) :
                                            (<CircularProgress size={20} />)
                                        }

                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    )
                }

            </Box>
        </SwipeableDrawer >
    )
}

export default ChatHandler;