import React from 'react'
import { Box, CircularProgress } from '@mui/material'

function ChatBotLoader() {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <CircularProgress />
        </Box>
    )
}

export default ChatBotLoader;