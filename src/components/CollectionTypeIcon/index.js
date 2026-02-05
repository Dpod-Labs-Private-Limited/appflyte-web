/**
 *
 * CollectionTypeIcon
 *
 */

import React from 'react';
import { TextFields, AlternateEmail, List, TodayOutlined, ImageOutlined, BallotOutlined }  from '@mui/icons-material';
import { HTMLSymbol, NumberSymbol, PasswordIcon, Rule, DataSetLinked } from '../../icons/extraIcons';
import { DataObject } from '../../icons/sideDrawerIcons';

function CollectionTypeIcon(props) {

  const { type } = props

  const styles = {
    icon: {
      height: '24px',
      width: '24px'
    }
  }

  const classes = styles;

  switch (type.toLowerCase()) {
    case 'text':
      return <TextFields color="primary" sx={classes.icon} />;
    case 'rich_text':
      return <HTMLSymbol color="primary" sx={classes.icon} />;
    case 'number':
      return <NumberSymbol color="primary" sx={classes.icon} />;
    case 'password':
      return <PasswordIcon color="primary" sx={classes.icon} />;
    case 'email':
      return <AlternateEmail color="primary" sx={classes.icon} />;
    case 'list':
      return <List color="primary" sx={classes.icon} />;
    case 'date':
      return <TodayOutlined color="primary" sx={classes.icon} />;
    case 'media':
      return <ImageOutlined color="primary" sx={classes.icon} />;
    case 'bool':
      return <Rule color="primary" sx={classes.icon} />;
    case 'component':
      return <BallotOutlined color="primary" sx={classes.icon} />;
    case 'json':
      return <DataObject color="primary" sx={classes.icon} />;
    case 'relation':
      return <DataSetLinked color="primary" sx={classes.icon} />;
    default:
      return <List color="primary" sx={classes.icon} />;
  }
}

CollectionTypeIcon.propTypes = {};

export default CollectionTypeIcon;
