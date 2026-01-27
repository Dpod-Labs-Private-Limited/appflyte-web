import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, LinearProgress } from '@mui/material';
import { getMainStyles } from '../styles/styles';

function LoadBar() {
    const theme = useTheme();
    const mainStyles = getMainStyles(theme);
    return (
        <Box sx={mainStyles.loadbarContainer}>
            <LinearProgress sx={mainStyles.loadbar} />
        </Box>
    )
}

export default LoadBar;