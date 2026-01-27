import React, { useEffect, useState } from 'react';
import { ReactSVG } from "react-svg";

import { useTheme } from '@mui/material/styles';
import { List, ListItem, Typography } from '@mui/material';
import '../../styles/subsidebar/styles.css';
import { IconSvg } from '../../utils/globalIcons';
import { getStyles } from './styles';
import "./styles.css"


function RootUserSidebar({ setPageType }) {

    const theme = useTheme();
    const styles = getStyles(theme);
    const [selectedMenuItem, setSelectedMenuItem] = useState(0);

    const menuItems = [
        { icon: IconSvg.rootauthIcon, label: 'Auth' }
    ];

    const handleMenuItemClick = (index, item) => {
        setSelectedMenuItem(index);
        setPageType(item)
    };

    return (

        <nav style={styles.sidebar}>
            <List>
                {menuItems?.map((item, index) => (
                    <ListItem
                        key={index}
                        style={styles.siebarItem(selectedMenuItem, index)}
                        onClick={() => handleMenuItemClick(index, item.label)}
                    >
                        <ReactSVG
                            src={item.icon}
                            beforeInjection={(svg) => {
                                svg.setAttribute('style', 'width: 18px; height:18px; display: block;');
                                svg.setAttribute('stroke', '#FFFFFF');
                            }}
                        />
                        <Typography sx={styles.siebarLabelText}>{item.label}</Typography>
                    </ListItem>
                ))}
            </List>
        </nav >
    );
}

export default RootUserSidebar;