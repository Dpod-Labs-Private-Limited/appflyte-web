/**
 *
 * DrawerListCollection
 *
 */

import React from 'react';
import { List, ListItemIcon, ListItemText, ListSubheader, Tooltip, Divider, Box } from '@mui/material';
import { DataObject } from '../../icons/sideDrawerIcons';
import { useMediaQuery } from 'react-responsive';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles';
import { styled } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';

function DrawerListCollection(props) {

  const { selectedTab, collectionPublishedList, showLimited, setSelectedTab, setSelectedCollection, setListOrAdd, navigate } = props

  const classes = styles;

  const open = useMediaQuery({ minWidth: 768 });

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    borderRadius: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    fontSize: 14,
    paddingTop: '8px',
    paddingBottom: '8px',
    color: "#FFFFFF",
    marginBottom: "10px",
    "&:hover": {
      backgroundColor: "#DEDEDE",
    },
    "&:focus": {
      backgroundColor: "#DEDEDE",
      "& .MuiListItemIcon-root": {
        color: "#000000",
      },
      "& .MuiListItemText-primary": {
        color: "#000000",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#DEDEDE",
      "& .MuiListItemIcon-root": {
        color: "#000000",
      },
      "& .MuiListItemText-primary": {
        color: "#000000",
      },
      "&:hover": {
        backgroundColor: "#DEDEDE",
        "& .MuiListItemIcon-root": {
          color: "#000000",
        },
        "& .MuiListItemText-primary": {
          color: "#000000",
        },
      },
    },
  }));

  return (
    <div>
      <List sx={classes.list1}>
        {/* {open ? <ListSubheader disableSticky sx={classes.ListHeader}><FormattedMessage {...messages.collections} /></ListSubheader> : ''} */}
        {collectionPublishedList && collectionPublishedList.length
          ?
          collectionPublishedList.map(collection =>
            <StyledMenuItem
              button
              selected={selectedTab === collection.api_singular_id}
              disabled={showLimited}
              onClick={() => {
                setSelectedTab(collection.api_singular_id)
                setSelectedCollection(collection)
                setListOrAdd('list')

                // Extract path up to collections/ or collections
                let currPath = window.location.pathname.match(/(.*\/collections)\/?/)[0];
                // Ensure path ends with /
                if (!currPath.endsWith('/')) {
                  currPath += '/';
                }
                // navigate to the collection
                navigate(currPath + collection.api_singular_id)
              }}
            >
              <ListItemIcon sx={classes.ListItemIcon}><DataObject /></ListItemIcon>
              <Tooltip
                title={collection.entity_name}
              >
                <ListItemText
                  primary={collection.entity_name}
                  primaryTypographyProps={{ noWrap: true, sx: selectedTab === collection.api_singular_id ? classes.listItemTextStyleSelected : classes.listItemTextStyle }}
                />
              </Tooltip>
            </StyledMenuItem>
          )
          :
          ''
        }
      </List>
    </div>
  );
}

DrawerListCollection.propTypes = {};

export default DrawerListCollection;
