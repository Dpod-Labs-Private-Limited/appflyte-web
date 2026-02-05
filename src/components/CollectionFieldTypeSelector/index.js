/**
 *
 * CollectionFieldTypeSelector
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Divider, LinearProgress } from '@mui/material';
import styles from './styles';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import CollectionFieldType from '../CollectionFieldType';

function CollectionFieldTypeSelector(props) {

  const { fieldTypeList, selectedTypeId, handleClose, handleTypeSelect } = props

  const classes = styles;

  const [loading, SetLoading] = useState(false)

  return (
    <Box>
      <Box px="20px" py="15px" display="flex" justifyContent="space-between">
        <Box>
          <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.heading} /></Typography>
        </Box>
        <Box>
          <Button size="small" disableElevation variant="contained" sx={classes.cancelBtn} onClick={handleClose}>
            <FormattedMessage {...messages.cancelBtn} />
          </Button>
        </Box>
      </Box>
      <Divider width="100%" />
      {loading ? <LinearProgress width="100%" /> : ''}
      <Box display="flex" flexWrap="wrap" overflow="auto" px="15px" py="15px" sx={{
        // It should show 3 items in a row
        '& > div': {
          width: 'calc(33.33% - 20px)',
          margin: '10px'
        }
      }}>
        {
          fieldTypeList.map(type =>
            <CollectionFieldType
              key={type.id}
              id={type.id}
              name={type.type}
              description={type.description}
              isSelected={type.id === selectedTypeId}
              onClick={handleTypeSelect.bind(this, type)}
            />
          )
        }
      </Box>
    </Box>
  );
}

CollectionFieldTypeSelector.propTypes = {
  selectedTypeId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleTypeSelect: PropTypes.func.isRequired,
};

export default CollectionFieldTypeSelector;
