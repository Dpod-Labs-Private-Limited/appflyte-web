/**
 *
 * CollectionTypeAddField
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Button, Divider, LinearProgress, Tabs, Tab } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function CollectionTypeAddField(props) {

  const { selectedType, handleClose, languageList } = props

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [loading, SetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  const [basicFields, setBasicFields] = useState({
    123: [
      {
        type: 'TextField',
        label: 'Name',
        name: 'name',
        value: ''
      },
      {
        type: 'Radio',
        label: 'Type',
        name: 'type',
        value: 'shortText',
        options: [
          {
            label: 'Short Text',
            value: 'shortText'
          },
          {
            label: 'Long Text',
            value: 'longText'
          },
        ]
      },

    ],
    124: [
      {
        type: 'TextField',
        label: 'Name',
        name: 'name',
        value: ''
      },
    ],
    125: [
      {
        type: 'TextField',
        label: 'Name',
        name: 'name',
        value: ''
      },
      {
        type: 'Select',
        label: 'Number Format',
        name: 'numberFormat',
        value: '',
        options: [
          {
            label: 'Integer (ex: 20)',
            value: 'integer'
          },
          {
            label: 'Decimal (ex: 10.22)',
            value: 'decimal'
          },
        ]
      },
    ],
    126: [
      {
        type: 'TextField',
        label: 'Name',
        name: 'name',
        value: ''
      },
    ],
    127: [
      {
        type: 'TextField',
        label: 'Name',
        name: 'name',
        value: ''
      }
    ],
    128: [
      {
        type: 'TextField',
        label: 'Name',
        name: 'name',
        value: ''
      },
      {
        type: 'TextArea',
        label: 'Values (one line per value)',
        name: 'values',
        value: ''
      }
    ]
  })

  const [advancedFields, setAdvancedFields] = useState([
    {
      type: 'TextField',
      label: 'Default Value',
      name: 'defaultValue',
      value: ''
    },
    {
      type: 'CheckBox',
      name: 'fieldProperties',
      value: [],
      options: [
        {
          label: 'Required Field',
          value: 'required'
        },
        {
          label: 'Private Field',
          value: 'private'
        },
        {
          label: 'Unique Field',
          value: 'unique'
        },
      ]
    },
    {
      type: 'TextField',
      label: 'Minimum Length',
      name: 'minimumLength',
      value: ''
    },
    {
      type: 'TextField',
      label: 'Maximum Length',
      name: 'maximumLength',
      value: ''
    },
  ])

  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

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
          <Button size="small" disableElevation variant="contained" color="secondary" sx={classes.saveBtn} onClick={handleClose}>
            <FormattedMessage {...messages.saveBtn} />
          </Button>
        </Box>
      </Box>
      <Divider width="100%" />
      {loading ? <LinearProgress width="100%" /> : ''}
      <Box display="flex" flexWrap="wrap" overflow="auto" px="15px" py="15px">
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="scrollable force tabs example"
            variant="scrollable"
            scrollButtons="off"
          >
            <Tab key={0} id={"tabInAppointmentUser_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.basic} />}  {...a11yProps(0)} />
            <Tab key={1} id={"tabInAppointmentUser_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.advanced} />}  {...a11yProps(1)} />
          </Tabs>
        </Box>
        <div
          role="tabpanel_in_collection_type_add_field_basic"
          hidden={tabValue !== 0}
          id={`scrollable-force-tabpanel_collection_type_add_field_basic`}
          aria-labelledby={`scrollable-force-tab_in_collection_type_add_field_basic`}
          key={"tabpanel_in_collection_type_add_field_basic_key"}
        >
          
        </div>
      </Box>
    </Box>
  );
}

CollectionTypeAddField.propTypes = {
  selectedType: PropTypes.object,
  handleClose: PropTypes.func.isRequired
};

export default CollectionTypeAddField;
