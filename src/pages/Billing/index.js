import React, { useState } from 'react'
import { getStyles } from './styles';
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography } from '@mui/material';

import History from './History';
import Usage from './Usage';
import Payment from './Payment';

function BilingHome() {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [tabValue, setTabValue] = useState('payment');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>

                <Box padding={'20px'}>

                    <Typography sx={styles.mainHeadingText}>Billing and Usage</Typography>

                    <Box sx={{ display: 'inline-block', borderBottom: 1, borderColor: 'divider', marginTop: '15px' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab
                                value="payment"
                                label={<Typography sx={{ fontSize: '16px', fontWeight: 600, textTransform: 'none' }}
                                >
                                    Overview
                                </Typography>} />
                            <Tab
                                value="history"
                                label={<Typography sx={{ fontSize: '16px', fontWeight: 600, textTransform: 'none' }}
                                >
                                    Billing History
                                </Typography>} />
                            <Tab
                                value="usage"
                                label={<Typography sx={{ fontSize: '16px', fontWeight: 600, textTransform: 'none' }}
                                >
                                    Usage
                                </Typography>} />
                        </Tabs>
                    </Box>

                    <Box>
                        {tabValue === "payment" && <Payment />}
                        {tabValue === "history" && <History />}
                        {tabValue === "usage" && <Usage />}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default BilingHome;