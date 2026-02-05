/**
 *
 * CollectionTypeAddListField
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Button, Divider, LinearProgress, Tabs, Tab, MenuItem, FormControlLabel, Checkbox, FormLabel, Collapse
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import messages from './messages';
import { useFormik } from 'formik';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden';
import { AddCircle, DeleteOutline } from '@mui/icons-material';
import { ArrowCircleUp, ArrowCircleDown } from '../../icons/extraIcons';
import { validateLanguage, getEditLocalRows, getEditFieldProps, getLocationObject, getEditEnglishName } from '../../Api/Services/collection/collectionUtilityServices';
import { SYSTEM_RESERVED_FIELD_NAMES } from '../../utils/constants';

function CollectionTypeAddListField(props) {

  const { handleClose, languageList, isLocalEnable, setFields, fieldType, fieldTypeName, editdata, selectedLanguage, fieldNames, setFieldNames } = props

  const classes = styles;

  const [loading, SetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [localRows, setLocalRows] = useState(editdata ? getEditLocalRows(editdata.fieldData.localized_texts) : [{ language: 'en', label: '' }])
  const [checkedList, setCheckedList] = useState(
    editdata &&
      editdata.fieldData.field_settings.field_values &&
      typeof editdata.fieldData.field_settings.field_values === 'object' &&
      isLocalEnable ?
      Object.keys(editdata.fieldData.field_settings.field_values).map(key => false) :
      [true])
  const [localRowsValues, setLocalRowsValues] = useState(
    editdata &&
      editdata.fieldData.field_settings.field_values &&
      typeof editdata.fieldData.field_settings.field_values === 'object' &&
      isLocalEnable ?
      getEditLocalRows(editdata.fieldData.field_settings.field_values) :
      [{ language: 'en', label: '' }])
  const [localErrors, setLocalErrors] = useState([])
  const [localErrorsValues, setLocalErrorsValues] = useState([])
  const [selectedFieldProps, setSelectedFieldProps] = useState(editdata ? getEditFieldProps(editdata.fieldData.field_settings) : [])
  const [initialFieldName, setInitialFieldName] = useState(editdata ? editdata.fieldData.name : '')
  const [allowMultiple, setAllowMultiple] = useState(editdata?.fieldData?.field_settings?.allow_multiple ?? false)
  const [addItemText, setAddItemText] = useState('')

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
    setLocalRowsValues((prevState) => [...prevState, { language: '', label: '' }])
    setCheckedList((prevState) => [...prevState, false])
  }

  const deleteLocalRow = (index) => {
    let tmpArr = [...localRows]
    let tmpArr2 = [...localRowsValues]
    let tmpArr3 = [...checkedList]
    tmpArr.splice(index, 1)
    tmpArr2.splice(index, 1)
    tmpArr3.splice(index, 1)
    setLocalRows(tmpArr)
    setLocalRowsValues(tmpArr2)
    setCheckedList(tmpArr3)
    if (formik.touched.name) {
      setLocalErrors(validateLanguage(tmpArr))
      setLocalErrorsValues(validateLanguage(tmpArr2))
    }
  }

  const handleLanguageChange = (index, event) => {
    const tempObj = [...localRows]
    const tempObj2 = [...localRowsValues]
    tempObj[index].language = event.target.value
    tempObj2[index].language = event.target.value
    setLocalRows(tempObj)
    setLocalRowsValues(tempObj2)
  }

  const handleChangeIndexLanguage = (index, event) => {
    const tempObj = [...localRows]
    tempObj[index].label = event.target.value
    setLocalRows(tempObj)
  }

  const handleChangeIndexLanguageValue = (index, event) => {
    const tempObj = [...localRowsValues]
    tempObj[index].label = event.target.value
    setLocalRowsValues(tempObj)
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

  const handleMultipleSelectCheckboxChanged = (e) => {
    setAllowMultiple(e.target.checked)
  }

  const handleToggleCollapse = (index) => {
    const tmpArr = [...checkedList]
    tmpArr[index] = !tmpArr[index]
    setCheckedList(tmpArr)
  }

  const valuesSameLengthVerify = (values) => {
    let count = -1
    for (const lang in values) {
      const valueInLang = values[lang].split('\n')
      if (count === -1)
        count = valueInLang.length
      else if (count !== valueInLang.length)
        return false
    }
    return true
  }

  const handleAddItemChange = (event) => {
    setAddItemText(event.target.value)
  }

  const handleItemAdd = (isLocal, localIndex) => {
    if (!addItemText)
      return
    if (isLocal) {
      const tempObj = [...localRowsValues]
      tempObj[localIndex].label = tempObj[localIndex].label + "\n" + addItemText
      setLocalRowsValues(tempObj)
    }
    else {
      const initialValues = {
        ...formik.values,
        fieldValues: formik.values.fieldValues + "\n" + addItemText
      }
      formik.setValues(initialValues, false)
    }
    setAddItemText('')
  }

  const validate = values => {
    const errors = {};
    if (values.name == null || values.name === "")
      errors.name = <FormattedMessage {...messages.nameReq} />
    if (SYSTEM_RESERVED_FIELD_NAMES.includes(values.name))
      errors.name = <FormattedMessage {...messages.systemReservedKeywordErr} />
    if (isLocalEnable) {
      if (localRows.length === 0 || localRowsValues.length === 0)
        errors.languages = <FormattedMessage {...messages.localReq} />
    }
    else {
      if (values.fieldValues == null || values.fieldValues === "")
        errors.fieldValues = <FormattedMessage {...messages.fieldValuesReq} />
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: editdata && editdata.fieldData ? getEditEnglishName(editdata.fieldData.localized_texts, editdata.fieldData.name) : '',
      fieldValues: editdata?.fieldData?.field_settings?.field_values?.en ?? '',
      defValue: editdata?.fieldData?.field_settings?.default_value ?? '',
    },
    validate,
    onSubmit: async values => {
      const languageValidateStatus = validateLanguage(localRows)
      const languageValidateStatusValues = isLocalEnable ? validateLanguage(localRowsValues) : []
      if (languageValidateStatus.length > 0 || languageValidateStatusValues.length > 0) {
        setLocalErrors(languageValidateStatus)
        setLocalErrorsValues(languageValidateStatusValues)
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
      const fieldValuesTemp = isLocalEnable ? getLocationObject(localRowsValues) : { en: values.fieldValues }
      const flagValues = valuesSameLengthVerify(fieldValuesTemp)
      if (!flagValues) {
        props.tostAlert(<FormattedMessage {...messages.valuesMismatch} />, "error")
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
          field_sub_type: allowMultiple ? 'multi' : 'single',
          localized_texts: localized_text_data,
          field_settings: {
            default_value: values.defValue,
            field_values: fieldValuesTemp,
            is_mandatory: selectedFieldProps.includes('required'),
            is_private: selectedFieldProps.includes('private'),
            allow_multiple: allowMultiple
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
              <FormControlLabel
                classes={{ label: classes.mediumLabel }}
                control={
                  <Checkbox
                    size='small'
                    checked={allowMultiple}
                    onChange={handleMultipleSelectCheckboxChanged}
                    name="allowMultiple"
                  />
                }
                label={<FormattedMessage {...messages.allowMultiple} />}
              />
              {
                !isLocalEnable &&
                <TextField
                  variant="filled"
                  label={<FormattedMessage {...messages.fieldValues} />}
                  margin="normal"
                  error={formik.errors.fieldValues && formik.touched.fieldValues}
                  helperText={(formik.touched.fieldValues) ? formik.errors.fieldValues : ""}
                  fullWidth
                  name="fieldValues"
                  multiline
                  rowsMax={6}
                  rows={3}
                  size="large"
                  type="text"
                  id="fieldValues"
                  autoComplete="fieldValues"
                  disabled={editdata?.fieldData?.id}
                  onChange={formik.handleChange}
                  value={formik.values.fieldValues}
                />
              }
              {
                !isLocalEnable && editdata?.fieldData?.id
                  ?
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <TextField
                      variant="filled"
                      label={<FormattedMessage {...messages.addItem} />}
                      margin="normal"
                      fullWidth
                      name="addItem"
                      size="small"
                      type="text"
                      id="addItem"
                      autoComplete="addItem"
                      onChange={handleAddItemChange}
                      value={addItemText}
                    />
                    <Button size="small" disableElevation variant="outlined" margin="normal" color="secondary" sx={classes.addBtn} onClick={handleItemAdd.bind(this, false, null)}>
                      <FormattedMessage {...messages.add} />
                    </Button>
                  </Box>
                  :
                  ''
              }
              {
                isLocalEnable
                  ?
                  <Box>
                    <Box sx={classes.localHeadBar}>
                      <Box>
                        <Typography sx={classes.localText}><FormattedMessage {...messages.locales} /></Typography>
                      </Box>
                      <Box>
                        {
                          !(editdata?.fieldData?.id) && <AddCircle color="secondary" sx={classes.addCircleIcon} onClick={addLocalRow} />
                        }
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
                        <Box key={"local_row_outer_key_" + index}>
                          <Box key={"local_row_key_" + index} display="flex" alignItems="center">
                            <Box>
                              {
                                checkedList[index]
                                  ?
                                  <ArrowCircleUp sx={classes.addCircleIcon} onClick={handleToggleCollapse.bind(this, index)} />
                                  :
                                  <ArrowCircleDown sx={classes.addCircleIcon} onClick={handleToggleCollapse.bind(this, index)} />
                              }
                            </Box>
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
                                // disabled={editdata?.fieldData?.id}
                                select
                                value={row.language}
                                onChange={handleLanguageChange.bind(this, index)}
                              >
                                {
                                  languageList.map((lang, langIndex) => <MenuItem key={lang.value + "_" + langIndex} value={lang.value}>{lang.name}</MenuItem>)
                                }
                              </TextField>
                            </Box>
                            <Box marginX="15px" width="310px">
                              {/* Dummy Box */}
                            </Box>
                            {
                              // !(editdata?.fieldData?.id) && <DeleteOutline color="secondary" sx={classes.addCircleIcon} onClick={deleteLocalRow.bind(this, index)} />
                            }
                            {
                              index > 0
                                ?
                                <DeleteOutline color="secondary" sx={classes.addCircleIcon} onClick={deleteLocalRow.bind(this, index)} />
                                :
                                <Box width="24px"></Box>
                            }
                          </Box>
                          <Collapse key={"local_row_collapse_key_" + index} in={checkedList[index]}>
                            <TextField
                              variant="filled"
                              label={<FormattedMessage {...messages.dispName} />}
                              margin="normal"
                              error={formik.touched.name && localErrors && localErrors[index] && localErrors[index].label && localErrors[index].label !== ""}
                              helperText={(localErrors && localErrors[index]?.label) ? localErrors[index].label : ""}
                              fullWidth
                              name={"language_label_content" + index}
                              disabled={index === 0 && editdata?.fieldData?.id}
                              size="small"
                              type="text"
                              id={"language_label_content" + index}
                              autoComplete={"language_label_content" + index}
                              inputProps={{ lang: row.language }}
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
                            <TextField
                              variant="filled"
                              label={<FormattedMessage {...messages.fieldValues} />}
                              margin="normal"
                              error={formik.touched.name && localErrorsValues && localErrorsValues[index] && localErrorsValues[index].label && localErrorsValues[index].label !== ""}
                              helperText={(localErrorsValues && localErrorsValues[index]?.label) ? localErrorsValues[index].label : ""}
                              fullWidth
                              multiline
                              disabled={editdata?.fieldData?.id}
                              rows={4}
                              rowsMax={6}
                              name={"language_label_values" + index}
                              size="small"
                              type="text"
                              id={"language_label_values" + index}
                              autoComplete={"language_label_values" + index}
                              inputProps={{ lang: row.language }}
                              onChange={handleChangeIndexLanguageValue.bind(this, index)}
                              value={localRowsValues[index].label}
                            />
                            {
                              editdata?.fieldData?.id
                                ?
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                  <TextField
                                    variant="filled"
                                    label={<FormattedMessage {...messages.addItem} />}
                                    margin="normal"
                                    fullWidth
                                    name="addItem"
                                    size="small"
                                    type="text"
                                    id="addItem"
                                    autoComplete="addItem"
                                    onChange={handleAddItemChange}
                                    value={addItemText}
                                  />
                                  <Button size="small" disableElevation variant="outlined" margin="normal" color="secondary" sx={classes.addBtn} onClick={handleItemAdd.bind(this, true, index)}>
                                    <FormattedMessage {...messages.add} />
                                  </Button>
                                </Box>
                                :
                                ''
                            }
                          </Collapse>
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
                // disabled={editdata?.fieldData?.id}
                fullWidth
                name="defValue"
                size="small"
                select
                id="defValue"
                autoComplete="defValue"
                onChange={formik.handleChange}
                value={formik.values.defValue}
              >
                {
                  isLocalEnable
                    ?
                    (
                      localRowsValues[0] && localRowsValues[0].label.split("\n").length > 0
                        ?
                        localRowsValues[0] && localRowsValues[0].label.split("\n").map((val, i) =>
                          <MenuItem key={i} value={i}>
                            {val}
                          </MenuItem>
                        )
                        :
                        <MenuItem key="items_not_added" value="" disabled>
                          <FormattedMessage {...messages.addItemsFirst} />
                        </MenuItem>
                    )
                    :
                    (
                      formik.values.fieldValues && formik.values.fieldValues.split("\n").length > 0
                        ?
                        formik.values.fieldValues.split("\n").map((val, i) =>
                          <MenuItem key={i} value={i}>
                            {val}
                          </MenuItem>
                        )
                        :
                        <MenuItem key="items_not_added" value="" disabled>
                          <FormattedMessage {...messages.addItemsFirst} />
                        </MenuItem>

                    )
                }
              </TextField>
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

CollectionTypeAddListField.propTypes = {
  handleClose: PropTypes.func.isRequired,
  languageList: PropTypes.object.isRequired,
  isLocalEnable: PropTypes.bool.isRequired,
  setFields: PropTypes.func.isRequired,
  fieldType: PropTypes.string.isRequired,
  fieldTypeName: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired
};

export default CollectionTypeAddListField;
