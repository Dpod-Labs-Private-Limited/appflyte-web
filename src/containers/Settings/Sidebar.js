import React, { useState, } from 'react';
import { List, ListItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { getStyles } from "../../styles/subsidebar/styles";
import '../../styles/subsidebar/styles.css';

import { IconSvg } from '../../utils/globalIcons';
import { ReactSVG } from "react-svg";
import { useAppContext } from '../../context/AppContext';

function SubSidebar({ handleMenuChange }) {

    const theme = useTheme();
    const styles = getStyles(theme);
    const { selectedWorkspace, selectedProject } = useAppContext();
    const [selectedMenuItem, setSelectedMenuItem] = useState(0);

    const menuItems = [
        { icon: IconSvg.genralSettingsIcon, label: 'General', path: 'general' },
        { icon: IconSvg.keyIcon, label: 'API Keys', path: 'api_keys' }
    ];

    const filteredMenuItems = () => {
        let items = []
        if (selectedWorkspace && selectedProject) {
            const selected_engine_name = selectedProject?.payload?.configuration?.engine_name
            const selected_sidebar_items = selectedProject?.payload?.configuration?.engine_config?.sidebar_items ?? {}
            const sub_sidebar_items = selected_sidebar_items?.['settings'] ?? [];
            const filteredMenuItemsList = menuItems?.filter(item => sub_sidebar_items?.map(subItem => subItem?.toLowerCase())?.includes(item?.path?.toLowerCase()));
            const main_sidebar_order = ['general', 'api_keys'];
            const sortSidebarItems = filteredMenuItemsList.slice().sort((a, b) => {
                const indexA = main_sidebar_order.indexOf(a.path);
                const indexB = main_sidebar_order.indexOf(b.path);
                return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
            });
            sortSidebarItems.forEach(item => { item.engine_name = selected_engine_name });
            items = sortSidebarItems;
        }
        return items;
    };

    const handleMenuItemClick = (index, path) => {
        setSelectedMenuItem(index);
        handleMenuChange(path)
    };

    return (
        <nav style={styles.sidebar}>
            <List>
                {filteredMenuItems()?.map((item, index) => (
                    <ListItem
                        key={index}
                        sx={styles.siebarItem(selectedMenuItem, index)}
                        onClick={() => handleMenuItemClick(index, item.path)}
                    >
                        <ReactSVG style={styles.siebarIcon} src={item.icon} className='sidebar_icon' />
                        <Typography sx={styles.siebarLabelText}>{item.label}</Typography>
                    </ListItem>
                ))}
            </List>
        </nav>
    )
}

export default SubSidebar;