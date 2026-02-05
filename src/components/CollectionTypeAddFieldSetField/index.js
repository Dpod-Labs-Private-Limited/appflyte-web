/**
 *
 * CollectionTypeAddFieldSetField
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Button, Divider, LinearProgress, Tabs, Tab, RadioGroup, Radio,
  Select, MenuItem, FormControlLabel, Checkbox
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import messages from './messages';
import { useFormik } from 'formik';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden';
import { getEditFieldProps, getEditLocalRows, getLocationObject, getEditEnglishName } from '../../Api/Services/collection/collectionUtilityServices';
import { SYSTEM_RESERVED_FIELD_NAMES } from '../../utils/constants';

function CollectionTypeAddFieldSetField(props) {

  const { handleClose, setFields, fieldType, fieldTypeName, editdata, fieldSetList, fieldSetListPublished, fieldNames, setFieldNames } = props

  const classes = styles;

  const [loading, SetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [localRows, setLocalRows] = useState(editdata ? getEditLocalRows(editdata.fieldData.localized_texts) : [])
  const [selectedFieldProps, setSelectedFieldProps] = useState(editdata ? getEditFieldProps(editdata.fieldData.field_settings) : [])
  const [fieldSetsFiltered, setFieldSetsFiltered] = useState([])
  const [initialFieldName, setInitialFieldName] = useState(editdata ? editdata.fieldData.name : '')

  useEffect(() => {
    if (fieldSetList && fieldSetListPublished && fieldSetList.length) {
      const tempArr = []
      if (editdata?.fieldData?.id) {
        const editPublishedId = editdata?.fieldData?.field_settings?.selected_fieldset ?? editdata?.fieldData?.component_def_id ?? editdata?.fieldData?.component_definition_id ?? null
        if (editPublishedId) {
          const tmpObj = fieldSetList.find(key => key.latest_published_entity_id === editPublishedId)
          if (tmpObj) {
            tempArr.push({
              fieldSetId: tmpObj.latest_published_entity_id,
              fieldSetName: tmpObj.entity_name + ' ( Version :- ' + (tmpObj.latest_published_version + 1) + ' )'
            })
          }
          const editPublishedObj = fieldSetListPublished.find(x => x.id === editPublishedId)
          if (editPublishedObj) {
            const editBaseEntityKey = editPublishedObj.base_defition_entity_key
            const currentEditVersion = editPublishedObj.version
            let allVersions = tmpObj
              ?
              fieldSetListPublished.filter(x => x.base_defition_entity_key === editBaseEntityKey && x.version >= currentEditVersion && x.id !== editPublishedId)
              :
              fieldSetListPublished.filter(x => x.base_defition_entity_key === editBaseEntityKey && x.version >= currentEditVersion)
            allVersions.forEach(item => {
              tempArr.push({
                fieldSetId: item.id,
                fieldSetName: item.entity_name + ' ( Version :- ' + (item.version + 1) + ' )'
              })
            })
          }
        }
      }
      else {
        fieldSetList.forEach(item => {
          if (item.latest_published_entity_id) {
            tempArr.push({
              fieldSetId: item.latest_published_entity_id,
              fieldSetName: item.entity_name
            })
          }
        })
      }
      setFieldSetsFiltered(tempArr)
    }
  }, [fieldSetList, fieldSetListPublished])

  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleCheckboxChanged = (e) => {
    let tempArr = [...selectedFieldProps]
    if (e.target.checked) {
      tempArr.push(e.target.name)
      setSelectedFieldProps([...tempArr])
    }
    else {
      const filteredArr = tempArr.filter(x => x != e.target.name)
      setSelectedFieldProps([...filteredArr])
    }
  }

  const validate = values => {
    const errors = {};
    if (values.name == null || values.name === "")
      errors.name = <FormattedMessage {...messages.nameReq} />
    if (SYSTEM_RESERVED_FIELD_NAMES.includes(values.name))
      errors.name = <FormattedMessage {...messages.systemReservedKeywordErr} />
    if (values.fieldSet == null || values.fieldSet === "")
      errors.fieldSet = <FormattedMessage {...messages.fieldSetReq} />
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: editdata && editdata.fieldData ? getEditEnglishName(editdata.fieldData.localized_texts, editdata.fieldData.name) : '',
      fieldSet: editdata?.fieldData?.field_settings?.selected_fieldset ?? editdata?.fieldData?.component_def_id ?? editdata?.fieldData?.component_definition_id ?? '',
      type: editdata?.fieldData?.field_sub_type ?? 'single'
    },
    validate,
    onSubmit: async values => {
      const tempFieldNames = [...fieldNames]
      if (initialFieldName)
        tempFieldNames.splice(tempFieldNames.indexOf(initialFieldName), 1)
      if (tempFieldNames.includes(values.name.trim().replaceAll(' ', '_').toLowerCase())) {
        formik.setErrors({
          name: <FormattedMessage {...messages.nameAlreadyUsed} />
        })
        return
      }
      SetLoading(true)
      const localized_text_data = { en: values.name }
      const resObj = {
        fieldName: localized_text_data.en,
        fieldType: fieldTypeName,
        name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
        fieldData: {
          id: editdata?.fieldData?.id ?? null,
          name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
          field_type: fieldType,
          field_sub_type: values.type,
          localized_texts: localized_text_data,
          component_definition_id: values.fieldSet,
          field_settings: {
            selected_fieldset: values.fieldSet,
            is_mandatory: selectedFieldProps.includes('required'),
            is_private: selectedFieldProps.includes('private')
          }
        }
      }
      if (editdata) {
        setFields(prevState => {
          const dataArr = [...prevState.data]
          dataArr[editdata.index] = {
            index: editdata.index,
            ...resObj
          }
          return ({
            columns: [...prevState.columns],
            data: dataArr
          })
        })
        setFieldNames(prev => {
          const tmpArr = [...prev]
          tmpArr.splice(tmpArr.indexOf(initialFieldName), 1)
          tmpArr.push(values.name.trim().replaceAll(' ', '_').toLowerCase())
          return tmpArr
        })
      }
      else {
        setFields(prevState => ({
          columns: [...prevState.columns],
          data: [...prevState.data, {
            index: prevState.data.length,
            ...resObj
          }]
        }))
        setFieldNames(prev => [...prev, values.name.trim().replaceAll(' ', '_').toLowerCase()])
      }
      SetLoading(false)
      handleClose()
    }
  });

  return (
    <Box>
      <form container onSubmit={formik.handleSubmit}>
        <Box px="20px" py="15px" display="flex" justifyContent="space-between">
          <Box>
            <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.heading} /></Typography>
          </Box>
          <Box>
            <Button size="small" disableElevation variant="contained" sx={classes.cancelBtn} onClick={handleClose}>
              <FormattedMessage {...messages.cancelBtn} />
            </Button>
            <Button type='submit' size="small" disableElevation variant="contained" color="secondary" sx={classes.saveBtn}>
              <FormattedMessage {...messages.saveBtn} />
            </Button>
          </Box>
        </Box>
        <Divider width="100%" />
        {loading ? <LinearProgress width="100%" /> : ''}
        <Box display="flex" flexWrap="wrap" width="100%" overflow="auto" px="15px" py="15px">
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
            style={{ width: '100%' }}
            hidden={tabValue !== 0}
            id={`scrollable-force-tabpanel_collection_type_add_field_basic`}
            aria-labelledby={`scrollable-force-tab_in_collection_type_add_field_basic`}
            key={"tabpanel_in_collection_type_add_field_basic_key1"}
          >
            <Box width="100%">
              <TextField
                variant="filled"
                label={<FormattedMessage {...messages.name} />}
                margin="normal"
                error={formik.errors.name && formik.touched.name}
                helperText={(formik.touched.name) ? formik.errors.name : ""}
                fullWidth
                name="name"
                size="small"
                type="text"
                id="name"
                autoComplete="name"
                disabled={editdata?.fieldData?.id}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <TextField
                variant="filled"
                label={<FormattedMessage {...messages.fieldSet} />}
                margin="normal"
                error={formik.errors.fieldSet && formik.touched.fieldSet}
                helperText={(formik.touched.fieldSet) ? formik.errors.fieldSet : ""}
                fullWidth
                name="fieldSet"
                size="small"
                select
                id="fieldSet"
                autoComplete="fieldSet"
                // disabled={editdata?.fieldData?.id}
                onChange={formik.handleChange}
                value={formik.values.fieldSet}
              >
                {
                  fieldSetsFiltered.length > 0
                    ?
                    fieldSetsFiltered.map(item => <MenuItem key={item.fieldSetId} value={item.fieldSetId}>{item.fieldSetName}</MenuItem>)
                    :
                    <MenuItem key="items_not_added" value="" disabled>
                      <FormattedMessage {...messages.noCollectionFound} />
                    </MenuItem>
                }
              </TextField>
              <RadioGroup aria-label="access" size="small" name="type" row value={formik.values.type} onChange={formik.handleChange}>
                <FormControlLabel classes={{ label: classes.mediumLabel }} value={"single"} control={<Radio size='small' />} label={<FormattedMessage {...messages.singleType} />} />
                <FormControlLabel classes={{ label: classes.mediumLabel }} value={"repeatable"} control={<Radio size='small' />} label={<FormattedMessage {...messages.repeatType} />} />
              </RadioGroup>
            </Box>
          </div>
          <div
            role="tabpanel_in_collection_type_add_field_basic"
            style={{ width: '100%' }}
            hidden={tabValue !== 1}
            id={`scrollable-force-tabpanel_collection_type_add_field_basic`}
            aria-labelledby={`scrollable-force-tab_in_collection_type_add_field_basic`}
            key={"tabpanel_in_collection_type_add_field_basic_key2"}
          >
            <Box width="100%">
              <Box display="flex" marginY="10px">
                <FormControlLabel
                  classes={{ label: classes.mediumLabel }}
                  control={
                    <Checkbox
                      size='small'
                      checked={selectedFieldProps.includes("required")}
                      onChange={handleCheckboxChanged}
                      name={"required"}
                    />
                  }
                  label={<FormattedMessage {...messages.reqFieldType} />}
                />
                <FormControlLabel
                  classes={{ label: classes.mediumLabel }}
                  control={
                    <Checkbox
                      size='small'
                      checked={selectedFieldProps.includes("private")}
                      onChange={handleCheckboxChanged}
                      name={"private"}
                    />
                  }
                  label={<FormattedMessage {...messages.privateField} />}
                />
              </Box>
            </Box>
          </div>
        </Box>
      </form>
    </Box>
  );
}

CollectionTypeAddFieldSetField.propTypes = {
  handleClose: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  fieldType: PropTypes.string.isRequired,
  fieldTypeName: PropTypes.string.isRequired,
};

export default CollectionTypeAddFieldSetField;
