/**
 *
 * AddFieldToListView
 *
 */

import React, { useState } from 'react';
import { Box, Typography, Divider, Button, LinearProgress, FormControlLabel, Checkbox } from '@mui/material';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden/index';
import styles from './styles';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Autocomplete } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { COLLECTION_FIELD_NAME } from '../../utils/constants';

function AddFieldToListView(props) {

  const { isForListView, addToListView, addFieldToSection, modalMetaData, handleClose, listViewFieldsIds, fieldList, editViewFieldsIds } = props

  const classes = styles;

  const getFilteredFields = () => {
    if (isForListView) {
      return fieldList.filter(x => {
        if (x.fieldType === COLLECTION_FIELD_NAME.COMPONENT || x.fieldType === COLLECTION_FIELD_NAME.RELATION)
          return false
        else
          return !listViewFieldsIds.includes(x.id)
      }
      )
    }
    else {
      if (modalMetaData && modalMetaData.rowLength > 1)
        return fieldList.filter(x => {
          if (x.fieldType === COLLECTION_FIELD_NAME.COMPONENT)
            return false
          else
            return !editViewFieldsIds.includes(x.id)
        })
      return fieldList.filter(x => !editViewFieldsIds.includes(x.id))
    }
  }

  const [allFields, setAllFields] = useState(getFilteredFields())
  const [selectedField, setSelectedField] = useState([])
  const [selectedFieldIds, setSelectedFieldIds] = useState([])

  const handleAutoCompleteCHane = (event, value) => {
    if (value != null) {
      if (isForListView) {
        if (!selectedFieldIds.includes(value.id)) {
          setSelectedField(prev => [...prev, { ...value }])
          setSelectedFieldIds(prev => [...prev, value.id])
        }
      }
      else {
        setSelectedField([{ ...value }])
        setSelectedFieldIds(prev => [value.id])
      }
    }
    else {
      if (!isForListView) {
        setSelectedField([])
        setSelectedFieldIds([])
      }
    }
  }

  const removeSelected = (index) => {
    if (isForListView) {
      setSelectedField(prev => {
        const tmpArr = [...prev]
        tmpArr.splice(index, 1)
        return tmpArr
      })
      setSelectedFieldIds(prev => {
        const tmpArr = [...prev]
        tmpArr.splice(index, 1)
        return tmpArr
      })
    }
    else {
      setSelectedField([])
      setSelectedFieldIds([])
    }
  }

  const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius: 1,
      p: 2,
      minWidth: 420,
    }}>
      <Box px="20px" py="15px" display="flex" justifyContent="space-between" alignItems={'center'}>
        <Box>
          <Typography sx={classes.addObjectiveHeading}>{isForListView ? <FormattedMessage {...messages.heading} /> : <FormattedMessage {...messages.heading2} />}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
          <Button
            size="small"
            disableElevation
            variant="contained"
            sx={classes.cancelBtn}
            onClick={handleClose}
          >
            <FormattedMessage {...messages.cancelBtn} />
          </Button>
          <Button
            disableElevation
            size="small"
            variant="contained"
            color="secondary"
            sx={classes.saveBtn}
            onClick={
              isForListView ?
                addToListView.bind(this, selectedField)
                :
                addFieldToSection.bind(this, modalMetaData.row, modalMetaData.col, selectedField)
            }
          >
            <FormattedMessage {...messages.saveBtn} />
          </Button>
        </Box>
      </Box>
      <Divider width="100%" />
      <Box px="20px" py="15px">
        <Autocomplete
          id="allFIles"
          options={allFields}
          getOptionLabel={(option) => option.localized_texts && option.localized_texts.en ? option.localized_texts.en : option.fieldName}
          margin="normal"
          renderInput={(params) => <TextField style={{ backgroundColor: 'white' }} {...params} size="small" margin="normal" label={<FormattedMessage {...messages.searchAfield} />} variant="filled" />}
          onChange={handleAutoCompleteCHane}
        />
        {
          selectedField.map((item, index) =>
            <Box sx={classes.moveableBox}>
              <Typography noWrap sx={classes.moveableBoxText}>{item.localized_texts && item.localized_texts.en ? item.localized_texts.en : item.fieldName}</Typography>
              <Box display="flex">
                <DeleteOutline color='secondary' sx={classes.moveableBoxIcon} onClick={removeSelected.bind(this, index)} />
              </Box>
            </Box>
          )
        }
      </Box>
    </Box>
  );
}

AddFieldToListView.propTypes = {};

export default AddFieldToListView;
