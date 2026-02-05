/**
 *
 * CollectionTypeAddNumberField
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Button, Divider, LinearProgress, Tabs, Tab, MenuItem, FormControlLabel, Checkbox, FormLabel
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import messages from './messages';
import { useFormik } from 'formik';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden';
import { AddCircle, DeleteOutline } from '@mui/icons-material';
import { validateLanguage, getEditLocalRows, getEditFieldProps, getLocationObject, getEditEnglishName } from '../../Api/Services/collection/collectionUtilityServices';
import { SYSTEM_RESERVED_FIELD_NAMES } from '../../utils/constants';

function CollectionTypeAddNumberField(props) {

  const { handleClose, languageList, isLocalEnable, setFields, fieldType, fieldTypeName, editdata, selectedLanguage, fieldNames, setFieldNames } = props


  const classes = styles;

  const [loading, SetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [localRows, setLocalRows] = useState(editdata ? getEditLocalRows(editdata.fieldData.localized_texts) : [{ language: 'en', label: '' }])
  const [localErrors, setLocalErrors] = useState([])
  const [selectedFieldProps, setSelectedFieldProps] = useState(editdata ? getEditFieldProps(editdata.fieldData.field_settings) : [])
  const [initialFieldName, setInitialFieldName] = useState(editdata ? editdata.fieldData.name : '')

  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const addLocalRow = () => {
    setLocalRows((prevState) => [...prevState, { language: '', label: '' }])
  }

  const deleteLocalRow = (index) => {
    let tmpArr = [...localRows]
    tmpArr.splice(index, 1)
    setLocalRows(tmpArr)
    if (formik.touched.name) {
      setLocalErrors(validateLanguage(tmpArr))
    }
  }

  const handleLanguageChange = (index, event) => {
    const tempObj = [...localRows]
    tempObj[index].language = event.target.value
    setLocalRows(tempObj)
  }

  const handleChangeIndexLanguage = (index, event) => {
    const tempObj = [...localRows]
    tempObj[index].label = event.target.value
    setLocalRows(tempObj)
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
    if (isLocalEnable && localRows.length === 0)
      errors.languages = <FormattedMessage {...messages.localReq} />
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: editdata && editdata.fieldData ? getEditEnglishName(editdata.fieldData.localized_texts, editdata.fieldData.name) : '',
      numberFormat: editdata?.fieldData?.field_settings?.number_format ?? 'integer',
      defValue: editdata?.fieldData?.field_settings?.default_value ?? '',
      minLength: editdata?.fieldData?.field_settings?.min_value ?? '',
      maxLength: editdata?.fieldData?.field_settings?.max_value ?? '',
    },
    validate,
    onSubmit: async values => {
      const languageValidateStatus = validateLanguage(localRows)
      if (languageValidateStatus.length > 0) {
        setLocalErrors(languageValidateStatus)
        return
      }
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
      const localized_text_data = localRows.length > 0 ? getLocationObject(localRows) : { en: values.name }
      const resObj = {
        fieldName: isLocalEnable ? localized_text_data[selectedLanguage] : localized_text_data.en,
        fieldType: fieldTypeName,
        name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
        fieldData: {
          id: editdata?.fieldData?.id ?? null,
          name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
          field_type: fieldType,
          field_sub_type: '',
          localized_texts: localized_text_data,
          field_settings: {
            default_value: values.defValue,
            min_value: values.minLength,
            max_value: values.maxLength,
            number_format: values.numberFormat,
            is_mandatory: selectedFieldProps.includes('required'),
            is_unique: selectedFieldProps.includes('unique'),
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
            key={"tabpanel_in_collection_type_add_field_basic_key"}
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
                onChange={(event) => {
                  handleChangeIndexLanguage(0, event)
                  formik.handleChange(event)
                }}
                value={formik.values.name}
              />
              <TextField
                variant="filled"
                label={<FormattedMessage {...messages.numberFormat} />}
                margin="normal"
                error={formik.errors.numberFormat && formik.touched.numberFormat}
                helperText={(formik.touched.numberFormat) ? formik.errors.numberFormat : ""}
                fullWidth
                name="numberFormat"
                size="small"
                select
                id="numberFormat"
                autoComplete="numberFormat"
                disabled={editdata?.fieldData?.id}
                onChange={formik.handleChange}
                value={formik.values.numberFormat}
              >
                <MenuItem key={0} value={"integer"}>
                  {"Integer (ex: 20)"}
                </MenuItem>
                <Divider />
                <MenuItem key={1} value={"decimal"}>
                  {"Decimal (ex: 10.22)"}
                </MenuItem>
              </TextField>
              {
                isLocalEnable
                  ?
                  <Box>
                    <Box sx={classes.localHeadBar}>
                      <Box>
                        <Typography sx={classes.localText}><FormattedMessage {...messages.locales} /></Typography>
                      </Box>
                      <Box>
                        <AddCircle color="secondary" sx={classes.addCircleIcon} onClick={addLocalRow} />
                      </Box>
                    </Box>
                    {
                      formik.touched.name && formik.errors.languages
                        ?
                        <FormLabel sx={classes.errorLabel}>
                          {formik.errors.languages}
                        </FormLabel>
                        :
                        ''
                    }
                    {
                      localRows.map((row, index) =>
                        <Box key={"local_row_key_" + index} display="flex" alignItems="center">
                          <Box sx={classes.formControl}>
                            <TextField
                              variant="filled"
                              label={<FormattedMessage {...messages.language} />}
                              margin="normal"
                              error={formik.touched.name && localErrors && localErrors[index] && localErrors[index].language && localErrors[index].language !== ""}
                              helperText={(localErrors && localErrors[index]?.language) ? localErrors[index].language : ""}
                              fullWidth
                              name={"language_label" + index}
                              size="small"
                              disabled={index === 0}
                              select
                              value={row.language}
                              onChange={handleLanguageChange.bind(this, index)}
                            >
                              {
                                languageList.map(lang => <MenuItem key={lang.value} value={lang.value}>{lang.name}</MenuItem>)
                              }
                            </TextField>
                          </Box>
                          <Box marginX="15px" width="310px">
                            <TextField
                              variant="filled"
                              label=""
                              margin="normal"
                              error={formik.touched.name && localErrors && localErrors[index] && localErrors[index].label && localErrors[index].label !== ""}
                              helperText={(localErrors && localErrors[index]?.label) ? localErrors[index].label : ""}
                              fullWidth
                              name={"language_label" + index}
                              size="small"
                              type="text"
                              id={"language_label" + index}
                              autoComplete={"language_label" + index}
                              inputProps={{ lang: row.language }}
                              disabled={index === 0 && editdata?.fieldData?.id}
                              onChange={(event) => {
                                handleChangeIndexLanguage(index, event)
                                if (index === 0)
                                  formik.handleChange({
                                    target: {
                                      name: "name",
                                      value: event.target.value
                                    }
                                  })
                              }}
                              value={row.label}
                            />
                          </Box>
                          {
                            index > 0
                              ?
                              <DeleteOutline color="secondary" sx={classes.addCircleIcon} onClick={deleteLocalRow.bind(this, index)} />
                              :
                              <Box width="24px"></Box>
                          }
                        </Box>
                      )
                    }
                  </Box>
                  :
                  ''
              }
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
              <TextField
                variant="filled"
                label={<FormattedMessage {...messages.defValue} />}
                margin="normal"
                error={formik.errors.defValue && formik.touched.defValue}
                helperText={(formik.touched.defValue) ? formik.errors.defValue : ""}
                fullWidth
                name="defValue"
                size="small"
                type="Number"
                id="defValue"
                autoComplete="defValue"
                // disabled={editdata?.fieldData?.id}
                onChange={formik.handleChange}
                value={formik.values.defValue}
              />
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
                <FormControlLabel
                  classes={{ label: classes.mediumLabel }}
                  control={
                    <Checkbox
                      size='small'
                      checked={selectedFieldProps.includes("unique")}
                      onChange={handleCheckboxChanged}
                      name={"unique"}
                    />
                  }
                  label={<FormattedMessage {...messages.uniqueField} />}
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Box width="250px">
                  <TextField
                    variant="filled"
                    label={<FormattedMessage {...messages.minLength} />}
                    margin="normal"
                    error={formik.errors.minLength && formik.touched.minLength}
                    helperText={(formik.touched.minLength) ? formik.errors.minLength : ""}
                    fullWidth
                    name="minLength"
                    size="small"
                    id="minLength"
                    autoComplete="minLength"
                    type="Number"
                    // disabled={editdata?.fieldData?.id}
                    inputProps={{ min: 0, step: formik.values.numberFormat === "integer" ? 1 : 0.1 }}
                    onChange={formik.handleChange}
                    value={formik.values.minLength}
                  />
                </Box>
                <Box width="250px">
                  <TextField
                    variant="filled"
                    label={<FormattedMessage {...messages.maxLength} />}
                    margin="normal"
                    error={formik.errors.maxLength && formik.touched.maxLength}
                    helperText={(formik.touched.maxLength) ? formik.errors.maxLength : ""}
                    fullWidth
                    name="maxLength"
                    size="small"
                    id="maxLength"
                    autoComplete="maxLength"
                    type="Number"
                    // disabled={editdata?.fieldData?.id}
                    inputProps={{ min: 0, step: formik.values.numberFormat === "integer" ? 1 : 0.1 }}
                    onChange={formik.handleChange}
                    value={formik.values.maxLength}
                  />
                </Box>
              </Box>
            </Box>
          </div>
        </Box>
      </form>
    </Box>
  );
}

CollectionTypeAddNumberField.propTypes = {
  handleClose: PropTypes.func.isRequired,
  languageList: PropTypes.object.isRequired,
  isLocalEnable: PropTypes.bool.isRequired,
  setFields: PropTypes.func.isRequired,
  fieldType: PropTypes.string.isRequired,
  fieldTypeName: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired
};

export default CollectionTypeAddNumberField;
