import React, { useState } from 'react';
import { getStyles } from './styles';
import { useTheme } from '@mui/material/styles';
import ameya_logo from "../../images/ameya_nav_logo.png"
import { Box, Typography, MenuItem, Menu, Chip } from '@mui/material';
import { ReactSVG } from "react-svg";
import { ArrowDropDown, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { IconSvg } from '../../utils/globalIcons';
import "./styles.css";

function RootUserNav() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [logoutmenu, setLogoutMenu] = useState(null);
    const navigate = useNavigate()

    const handleClick = (event) => {
        setLogoutMenu(event.currentTarget)
    }

    const handleClose = () => {
        setLogoutMenu(null)
    }

    const handleLogout = () => {
        navigate("/login")
        localStorage.clear()
        sessionStorage.clear()
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <nav style={styles.navbar}>
                <Box sx={styles.navLeftContent}>
                    <Box>
                        <img src={ameya_logo} alt="Upperline Health Logo" style={{ ...styles.navbarBrand }} />
                    </Box>
                </Box>

                <Box sx={styles.navRightContent}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', alignSelf: 'center' }}>
                        <Box marginLeft={'20px'}>
                            <Chip
                                avatar={
                                    <ReactSVG
                                        className="rootuser"
                                        src={IconSvg.rootuserIcon}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginLeft: '20px',
                                            marginTop: '5px'
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                        <Typography sx={styles.nameText}>Root User</Typography>
                                        <ArrowDropDown
                                            sx={{ cursor: 'pointer', ml: 1 }}
                                            onClick={handleClick}
                                        />
                                    </Box>
                                }
                                sx={{
                                    height: '45px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '20px',
                                    paddingRight: '10px',
                                    '& .MuiChip-avatar': {
                                        marginLeft: '8px',
                                        marginRight: '4px',
                                    },
                                    '& .MuiChip-label': {
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                }}
                            />

                            <Box>
                                <Menu
                                    anchorEl={logoutmenu}
                                    open={logoutmenu}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => handleLogout()} sx={{ ...styles.paratext, dispaly: 'flex', alignItems: 'center' }}>
                                        <Typography>Logout&nbsp;</Typography>
                                        <Logout />
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </nav>
        </Box>
    )
}

export default RootUserNav;