/**
 *
 * CollectionFieldType
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { Box, Typography} from '@mui/material';
import CollectionTypeIcon from '../CollectionTypeIcon';

function CollectionFieldType(props) {

  const classes = styles

  const { id, name, description, isSelected, onClick } = props

  return (
    <Box sx={isSelected ? classes.rootBoxSelected : classes.rootBox} onClick={onClick}>
      <CollectionTypeIcon type={id} />
      <Typography sx={classes.fieldTypeName}>{name}</Typography>
      <Typography sx={classes.fieldTypeDesc}>{description ?? '-'}</Typography>
    </Box>
  );
}

CollectionFieldType.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default CollectionFieldType;
