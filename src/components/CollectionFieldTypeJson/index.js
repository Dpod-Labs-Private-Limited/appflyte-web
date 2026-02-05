/**
 *
 * CollectionFieldTypeJson
 *
 */

import React, { useState } from 'react';
import {
  Box, Typography, Button, LinearProgress, Tabs, Tab, FormLabel, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox
} from '@mui/material';
import styles from './styles';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden';
import { AddCircle, DeleteOutline } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { validateLanguage, getEditLocalRows, getLocationObject, getEditEnglishName } from '../../Api/Services/collection/collectionUtilityServices';
import { SYSTEM_RESERVED_FIELD_NAMES } from '../../utils/constants';

function CollectionFieldTypeJson(props) {

  const { handleClose, languageList, isLocalEnable, setFields, fieldType, fieldTypeName, editdata, selectedLanguage, fieldNames, setFieldNames } = props

  const classes = styles;

  const useStylesReddit = {
    root: {
      // border: '1px solid #e2e2e1',
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
      transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#FFFFFF',
      },
      '&$focused': {
        backgroundColor: '#FFFFFF',
      },
      "&.MuiInputBase-root.Mui-disabled": {
        backgroundColor: '#FFFFFF',
      },
      "&.MuiFormHelperText-contained": {
        margin: "0px 0px 0px"
      }
    },
    focused: {
      backgroundColor: '#FFFFFF',
    }
  }
  const classesTextField = useStylesReddit;

  const [loading, SetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [localRows, setLocalRows] = useState(editdata ? getEditLocalRows(editdata.fieldData.localized_texts) : [])
  const [localErrors, setLocalErrors] = useState([])
  const [headerRows, setHeaderRows] = useState([])
  const [initialFieldName, setInitialFieldName] = useState(editdata ? editdata.fieldData.name : '')

  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
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

  const addHeaderRow = () => {
    setHeaderRows((prevState) => [...prevState, { key: '', value: '' }])
  }

  const deleteHeaderRow = (index) => {
    let tmpArr = [...headerRows]
    tmpArr.splice(index, 1)
    setHeaderRows(tmpArr)
  }

  const handleHeaderKeyChange = (index, event) => {
    const tempObj = [...headerRows]
    tempObj[index].key = event.target.value
    setHeaderRows(tempObj)
  }

  const handleChangeValueHeader = (index, event) => {
    const tempObj = [...headerRows]
    tempObj[index].value = event.target.value
    setLocalRows(tempObj)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const validate = values => {
    const errors = {};
    if (values.name == null || values.name === "")
      errors.name = <FormattedMessage {...messages.nameReq} />
    if (SYSTEM_RESERVED_FIELD_NAMES.includes(values.name))
      errors.name = <FormattedMessage {...messages.systemReservedKeywordErr} />
    if (isLocalEnable && localRows.length === 0)
      errors.languages = <FormattedMessage {...messages.localReq} />
    if (values.type === 'auto') {
      if (values.apiUrl == null || values.apiUrl === "")
        errors.apiUrl = <FormattedMessage {...messages.apiUrlReq} />
      if (values.apiMethod == null || values.apiMethod === "")
        errors.apiMethod = <FormattedMessage {...messages.apiMethodReq} />
      if (values.apiAuthentication == null || values.apiAuthentication === "")
        errors.apiAuthentication = <FormattedMessage {...messages.apiAuthenticationReq} />
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: editdata && editdata.fieldData ? getEditEnglishName(editdata.fieldData.localized_texts, editdata.fieldData.name) : '',
      apiUrl: editdata?.fieldData?.field_settings?.api_url ?? '',
      apiMethod: editdata?.fieldData?.field_settings?.api_method ?? '',
      apiAuthentication: editdata?.fieldData?.field_settings?.api_authentication ?? '',
      userName: editdata?.fieldData?.field_settings?.user_name ?? '',
      password: editdata?.fieldData?.field_settings?.password ?? '',
      jsonSchema: editdata?.fieldData?.field_settings?.json_schema ?? '',
      sampleJsonResponse: editdata?.fieldData?.field_settings?.sample_response ?? '',
      frequencyDuration: editdata?.fieldData?.field_settings?.frequence_duration ?? 0,
      type: editdata?.fieldData?.field_sub_type ?? 'manual',
      schemaType: editdata?.fieldData?.field_settings?.schema_type ?? 'manual',
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
        name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
        fieldType: fieldTypeName,
        fieldData: {
          id: editdata?.fieldData?.id ?? null,
          name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
          field_type: fieldType,
          field_sub_type: values.type,
          localized_texts: localized_text_data,
          field_settings: {
            schema_type: values.schemaType,
            json_schema: values.jsonSchema,
            json_schema: values.jsonSchema,
            sample_response: values.sampleJsonResponse,
            frequence_duration: values.frequencyDuration,
            api_authentication: values.apiAuthentication,
            api_method: values.apiMethod,
            api_url: values.apiUrl,
            user_name: values.userName,
            password: values.password
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
    <Box display="flex" flexDirection="column" justifyContent="space-between" overflow="auto" width="550px" height="100%" sx={classes.root}>
      <form container onSubmit={formik.handleSubmit}>
        <Box>
          <Box px="20px" py="15px" marginTop="20px" display="flex" justifyContent="space-between">
            <Box>
              <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.searchAndAddHeading} /></Typography>
            </Box>
            <Box>
              <Button disableElevation size="small" variant="contained" sx={classes.cancelBtn} onClick={handleClose}>
                <FormattedMessage {...messages.cancelBtn} />
              </Button>
              <Button type="submit" disableElevation size="small" variant="contained" color="secondary" sx={classes.saveBtn}>
                <FormattedMessage {...messages.saveBtn} />
              </Button>
            </Box>
          </Box>
          {
            loading ? <LinearProgress width="100%" /> : ''
          }
          <Box height="100%" mt="20px" paddingX="20px">
            <Box display="flex" flexDirection="column" width="100%">
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
                  <Tab key={0} id={"tabInJSONfieldType_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.basic} />}  {...a11yProps(0)} />
                  <Tab key={1} id={"tabInJSONfieldType_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.advanced} />}  {...a11yProps(1)} />
                </Tabs>
              </Box>
              <div
                role="tabpanel_in_collection_type_add_json_basic"
                style={{ width: '100%' }}
                hidden={tabValue !== 0}
                id={`scrollable-force-tabpanel_collection_type_add_json_basic`}
                aria-labelledby={`scrollable-force-tab_in_collection_type_add_json_basic`}
                key={"tabpanel_in_collection_type_add_json_basic_key"}
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
                    InputProps={{ classes: classesTextField }}
                    inputProps={{ maxLength: 25 }}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
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
                                  InputProps={{ classes: classesTextField }}
                                  name={"language_label" + index}
                                  size="small"
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
                                  InputProps={{ classes: classesTextField }}
                                  inputProps={{ maxLength: 50, lang: row.language }}
                                  onChange={handleChangeIndexLanguage.bind(this, index)}
                                  value={row.label}
                                />
                              </Box>
                              <DeleteOutline color="secondary" sx={classes.addCircleIcon} onClick={deleteLocalRow.bind(this, index)} />
                            </Box>
                          )
                        }
                      </Box>
                      :
                      ''
                  }
                  <Typography sx={classes.typeText}><FormattedMessage {...messages.type} /></Typography>
                  <RadioGroup aria-label="access" size="small" name="type" row value={formik.values.type} onChange={formik.handleChange}>
                    <FormControlLabel classes={{ label: classes.mediumLabel }} value={"manual"} control={<Radio size='small' />} label={<FormattedMessage {...messages.typeShort} />} />
                    <FormControlLabel classes={{ label: classes.mediumLabel }} value={"auto"} control={<Radio size='small' />} label={<FormattedMessage {...messages.typeLong} />} />
                  </RadioGroup>
                  {
                    formik.values.type === 'auto'
                      ?
                      <Box width="100%">
                        <TextField
                          variant="filled"
                          label={<FormattedMessage {...messages.apiUrl} />}
                          margin="normal"
                          error={formik.errors.apiUrl && formik.touched.apiUrl}
                          helperText={(formik.touched.apiUrl) ? formik.errors.apiUrl : ""}
                          fullWidth
                          name="apiUrl"
                          size="small"
                          type="text"
                          id="apiUrl"
                          autoComplete="apiUrl"
                          InputProps={{ classes: classesTextField }}
                          inputProps={{ maxLength: 25 }}
                          onChange={formik.handleChange}
                          value={formik.values.apiUrl}
                        />
                        <Typography sx={classes.typeText}><FormattedMessage {...messages.freqRefresh} /></Typography>
                        <Box display="flex" width="100%" alignItems="center">
                          <Box width="150px" marginRight="10px">
                            <TextField
                              variant="filled"
                              label=""
                              margin="normal"
                              error={formik.errors.frequencyDuration && formik.touched.frequencyDuration}
                              helperText={(formik.touched.frequencyDuration) ? formik.errors.frequencyDuration : ""}
                              fullWidth
                              name="frequencyDuration"
                              size="small"
                              type="Number"
                              id="frequencyDuration"
                              autoComplete="frequencyDuration"
                              InputProps={{ classes: classesTextField }}
                              inputProps={{ maxLength: 5 }}
                              onChange={formik.handleChange}
                              value={formik.values.frequencyDuration}
                            />
                          </Box>
                          <Typography sx={classes.minLabel}><FormattedMessage {...messages.minute} /></Typography>
                        </Box>
                        <Box display="flex" width="100%" justifyContent="space-between">
                          <Box width="235px">
                            <TextField
                              variant="filled"
                              label={<FormattedMessage {...messages.apiMethod} />}
                              margin="normal"
                              error={formik.errors.apiMethod && formik.touched.apiMethod}
                              helperText={(formik.touched.apiMethod) ? formik.errors.apiMethod : ""}
                              fullWidth
                              name="apiMethod"
                              size="small"
                              select
                              id="apiMethod"
                              autoComplete="apiMethod"
                              InputProps={{ classes: classesTextField }}
                              onChange={formik.handleChange}
                              value={formik.values.apiMethod}
                            >
                              <MenuItem key={0} value={"post"}>
                                {"Post"}
                              </MenuItem>
                              <MenuItem key={1} value={"get"}>
                                {"Get"}
                              </MenuItem>
                            </TextField>
                          </Box>
                          <Box width="235px">
                            <TextField
                              variant="filled"
                              label={<FormattedMessage {...messages.apiAuthentication} />}
                              margin="normal"
                              error={formik.errors.apiAuthentication && formik.touched.apiAuthentication}
                              helperText={(formik.touched.apiAuthentication) ? formik.errors.apiAuthentication : ""}
                              fullWidth
                              name="apiAuthentication"
                              size="small"
                              select
                              id="apiAuthentication"
                              autoComplete="apiAuthentication"
                              InputProps={{ classes: classesTextField }}
                              onChange={formik.handleChange}
                              value={formik.values.apiAuthentication}
                            >
                              <MenuItem key={0} value={"none"}>
                                {"No Authentication"}
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Box>
                        <TextField
                          variant="filled"
                          label={<FormattedMessage {...messages.userName} />}
                          margin="normal"
                          error={formik.errors.userName && formik.touched.userName}
                          helperText={(formik.touched.userName) ? formik.errors.userName : ""}
                          fullWidth
                          name="userName"
                          size="small"
                          type="text"
                          id="userName"
                          autoComplete="userName"
                          InputProps={{ classes: classesTextField }}
                          inputProps={{ maxLength: 25 }}
                          onChange={formik.handleChange}
                          value={formik.values.userName}
                        />
                        <TextField
                          variant="filled"
                          label={<FormattedMessage {...messages.password} />}
                          margin="normal"
                          error={formik.errors.password && formik.touched.password}
                          helperText={(formik.touched.password) ? formik.errors.password : ""}
                          fullWidth
                          name="password"
                          size="small"
                          type="password"
                          id="password"
                          autoComplete="password"
                          InputProps={{ classes: classesTextField }}
                          inputProps={{ maxLength: 25 }}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                        <Box sx={classes.localHeadBar}>
                          <Box>
                            <Typography sx={classes.localText}><FormattedMessage {...messages.header} /></Typography>
                          </Box>
                          <Box>
                            <AddCircle color="secondary" sx={classes.addCircleIcon} onClick={addHeaderRow} />
                          </Box>
                        </Box>
                        {
                          headerRows.map((row, index) =>
                            <Box display="flex" alignItems="center">
                              <Box marginX="15px" width="165px">
                                <TextField
                                  variant="filled"
                                  label={<FormattedMessage {...messages.key} />}
                                  margin="normal"
                                  error={formik.errors.header && formik.errors.header[index] && formik.touched.name}
                                  helperText={(formik.errors.header && formik.errors.header[index]) ? formik.errors.header[index] : ""}
                                  fullWidth
                                  name={"header_key_label" + index}
                                  size="small"
                                  type="text"
                                  id={"header_key_label" + index}
                                  autoComplete={"header_key_label" + index}
                                  InputProps={{ classes: classesTextField }}
                                  inputProps={{ maxLength: 25 }}
                                  onChange={handleHeaderKeyChange.bind(this, index)}
                                  value={row.key}
                                />
                              </Box>
                              <Box marginX="15px" width="165px">
                                <TextField
                                  variant="filled"
                                  label={<FormattedMessage {...messages.value} />}
                                  margin="normal"
                                  error={formik.errors.header && formik.errors.header[index] && formik.touched.name}
                                  helperText={(formik.errors.header && formik.errors.header[index]) ? formik.errors.header[index] : ""}
                                  fullWidth
                                  name={"header_value_label" + index}
                                  size="small"
                                  type="text"
                                  id={"header_value_label" + index}
                                  autoComplete={"header_value_label" + index}
                                  InputProps={{ classes: classesTextField }}
                                  inputProps={{ maxLength: 25 }}
                                  onChange={handleChangeValueHeader.bind(this, index)}
                                  value={row.value}
                                />
                              </Box>
                              <DeleteOutline color="secondary" sx={classes.addCircleIcon} onClick={deleteHeaderRow.bind(this, index)} />
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
                role="tabpanel_in_collection_type_add_json_basic"
                style={{ width: '100%' }}
                hidden={tabValue !== 1}
                id={`scrollable-force-tabpanel_collection_type_add_json_basic`}
                aria-labelledby={`scrollable-force-tab_in_collection_type_add_json_basic`}
                key={"tabpanel_in_collection_type_add_json_basic_key"}
              >
                <Box width="100%">
                  <Typography sx={classes.typeText}><FormattedMessage {...messages.jsonSchema} /></Typography>
                  <RadioGroup aria-label="access" size="small" name="schemaType" row value={formik.values.schemaType} onChange={formik.handleChange}>
                    <FormControlLabel classes={{ label: classes.mediumLabel }} value={"manual"} control={<Radio size='small' />} label={<FormattedMessage {...messages.manualSchema} />} />
                    <FormControlLabel classes={{ label: classes.mediumLabel }} value={"auto"} control={<Radio size='small' />} label={<FormattedMessage {...messages.autoSchema} />} />
                  </RadioGroup>
                  {
                    formik.values.schemaType === 'auto'
                      ?
                      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                        <TextField
                          variant="filled"
                          label={<FormattedMessage {...messages.sampleJsonResponse} />}
                          margin="normal"
                          error={formik.errors.sampleJsonResponse && formik.touched.sampleJsonResponse}
                          helperText={(formik.touched.sampleJsonResponse) ? formik.errors.sampleJsonResponse : ""}
                          fullWidth
                          name="sampleJsonResponse"
                          multiline
                          rowsMax={8}
                          rows={4}
                          size="large"
                          type="text"
                          id="sampleJsonResponse"
                          autoComplete="sampleJsonResponse"
                          InputProps={{ classes: classesTextField }}
                          onChange={formik.handleChange}
                          value={formik.values.sampleJsonResponse}
                        />
                        <Button disableElevation size="small" variant="outlined" color='secondary' sx={classes.generateBtn} onClick={null}>
                          <FormattedMessage {...messages.generateBtn} />
                        </Button>
                      </Box>
                      :
                      ''
                  }
                  <Box width="100%">
                    <TextField
                      variant="filled"
                      label={<FormattedMessage {...messages.jsonSchema} />}
                      margin="normal"
                      error={formik.errors.jsonSchema && formik.touched.jsonSchema}
                      helperText={(formik.touched.jsonSchema) ? formik.errors.jsonSchema : ""}
                      fullWidth
                      name="jsonSchema"
                      multiline
                      rowsMax={8}
                      rows={4}
                      size="large"
                      type="text"
                      id="jsonSchema"
                      autoComplete="jsonSchema"
                      InputProps={{ classes: classesTextField }}
                      onChange={formik.handleChange}
                      value={formik.values.jsonSchema}
                    />
                  </Box>
                </Box>
              </div>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

CollectionFieldTypeJson.propTypes = {
  handleClose: PropTypes.func.isRequired,
  languageList: PropTypes.object.isRequired,
  isLocalEnable: PropTypes.bool.isRequired,
  setFields: PropTypes.func.isRequired,
  fieldType: PropTypes.string.isRequired,
  fieldTypeName: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired
};

export default CollectionFieldTypeJson;
