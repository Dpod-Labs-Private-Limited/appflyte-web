/**
 *
 * CollectionTypeAddRelationField
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Button, Divider, LinearProgress, Tabs, Tab, MenuItem, FormControlLabel, Checkbox
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import messages from './messages';
import { useFormik } from 'formik';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden';
import { One2One, One2Many, OneOnlyOne, Many2One, Many2Many } from '../../icons/extraIcons';
import { getEditFieldProps, getEditLocalRows, getLocationObject, getEditEnglishName } from '../../Api/Services/collection/collectionUtilityServices';
import CollectionTypesService from '../../Api/Services/collection/collectionTypesService';
import { SYSTEM_RESERVED_FIELD_NAMES } from '../../utils/constants';

function CollectionTypeAddRelationField(props) {

  const { handleClose, setFields, fieldType, fieldTypeName, editdata, collectionTypeList, fieldNames, setFieldNames, collectionTypeName } = props

  const classes = styles;

  const [loading, SetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [localRows, setLocalRows] = useState(editdata ? getEditLocalRows(editdata.fieldData.localized_texts) : [])
  const [selectedFieldProps, setSelectedFieldProps] = useState(editdata ? getEditFieldProps(editdata.fieldData.field_settings) : [])
  const [selectedRelationType, setSelectedRelationType] = useState(editdata ? editdata.fieldData.relation_type : 'ONE')
  const [selectedRelationBackType, setSelectedRelationBackType] = useState(editdata ? editdata.fieldData.reverse_relation_type : 'ONE')
  const [selectedRelationIcon, setSelectedRelationIcon] = useState(editdata && editdata.fieldData.field_settings.relation_icon_name ? editdata.fieldData.field_settings.relation_icon_name : 'ONE_WAY_ARROW')
  const [collectionTypeFilteredList, setCollectionTypeFilteredList] = useState([])
  const [selectedCollectionLinkField, setSelectedCollectionLinkField] = useState(null)
  const [selectedCollectionDetails, setSelectedCollectionDetails] = useState(null)
  const [initialFieldName, setInitialFieldName] = useState(editdata ? editdata.fieldData.name : '')

  useEffect(() => {
    if (collectionTypeList && collectionTypeList.length) {
      const tempArr = []
      collectionTypeList.forEach(item => {
        if (item.latest_published_entity_id) {
          tempArr.push({
            colectionId: item.latest_published_entity_id,
            collectionDefinitionId: item.id,
            collectionName: item.entity_name
          })
        }
      })
      setCollectionTypeFilteredList(tempArr)
    }
  }, [collectionTypeList])

  useEffect(() => {
    if (editdata) {
      fetchCollectionDetails(editdata.fieldData.collection_def_id || editdata.fieldData.field_settings.selected_collection || editdata.fieldData.linked_to_collection_definition_id)
    }
  }, [])

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

  function fetchCollectionDetails(id) {
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const collectionId = id
    CollectionTypesService
      .getCollectionConfiguration(accID, subscriptionId, subscriberId, collectionId)
      .then(res => {
        setSelectedCollectionDetails(res.data)
        if (res.data.link_fields && res.data.link_fields.length > 0) {
          const linkFieldPattern = res.data.link_fields[0]
          const linkFieldData = res.data.fields_list.find(x => x.field_path_pattern === linkFieldPattern)
          if (linkFieldData)
            setSelectedCollectionLinkField(linkFieldData.field_name)
          else if (res.data.fields_list.length > 0)
            setSelectedCollectionLinkField(res.data.fields_list[0].field_name)
          else
            setSelectedCollectionLinkField(null)
        }
        if (editdata?.fieldData?.id) {
          const basedefId = res.data.base_defition_entity_key.replaceAll("cd_", "")
          const updatedColObj = collectionTypeList.find(x => x.id === basedefId)
          if (updatedColObj)
            formik.setValues({ ...formik.values, selectCollection: updatedColObj.latest_published_entity_id })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const validate = values => {
    const errors = {};
    if (values.name == null || values.name === "")
      errors.name = <FormattedMessage {...messages.nameReq} />
    if (SYSTEM_RESERVED_FIELD_NAMES.includes(values.name))
      errors.name = <FormattedMessage {...messages.systemReservedKeywordErr} />
    if (values.selectCollection == null || values.selectCollection === "")
      errors.selectCollection = <FormattedMessage {...messages.colReq} />
    if (selectedCollectionLinkField == null || selectedCollectionLinkField === "")
      errors.selectCollection = <FormattedMessage {...messages.linkFieldNotDefinedForThis} />
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: editdata && editdata.fieldData ? getEditEnglishName(editdata.fieldData.localized_texts, editdata.fieldData.name) : '',
      selectCollection: editdata?.fieldData?.field_settings?.selected_collection ?? '',
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
      const selectedColBase = collectionTypeFilteredList.find(x => x.colectionId === values.selectCollection)
      const resObj = {
        fieldName: localized_text_data.en,
        fieldType: fieldTypeName,
        name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
        fieldData: {
          id: editdata?.fieldData?.id ?? null,
          name: values.name.trim().replaceAll(' ', '_').toLowerCase(),
          field_type: fieldType,
          field_sub_type: selectedRelationType,
          localized_texts: localized_text_data,
          relation_type: selectedRelationType,
          reverse_relation_type: selectedRelationBackType,
          collection_def_id: values.selectCollection,
          field_settings: {
            selected_collection: values.selectCollection,
            selected_collection_definition_id: selectedColBase ? selectedColBase.collectionDefinitionId : null,
            is_mandatory: selectedFieldProps.includes('required'),
            is_private: selectedFieldProps.includes('private'),
            relation_icon_name: selectedRelationIcon,
            link_field: selectedCollectionLinkField
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
              <Box width="450px">
                <TextField
                  variant="filled"
                  label={<FormattedMessage {...messages.selectCollection} />}
                  margin="normal"
                  error={formik.errors.selectCollection && formik.touched.selectCollection}
                  helperText={(formik.touched.selectCollection) ? formik.errors.selectCollection : ""}
                  fullWidth
                  name="selectCollection"
                  size="small"
                  select
                  id="selectCollection"
                  disabled={editdata?.fieldData?.id}
                  onChange={(e) => {
                    fetchCollectionDetails(e.target.value)
                    formik.handleChange(e)
                  }}
                  value={formik.values.selectCollection}
                >
                  {
                    collectionTypeFilteredList.length > 0
                      ?
                      collectionTypeFilteredList.map(item => <MenuItem key={item.colectionId} value={item.colectionId}>{item.collectionName}</MenuItem>)
                      :
                      <MenuItem key="items_not_added" value="" disabled>
                        <FormattedMessage {...messages.noCollectionFound} />
                      </MenuItem>
                  }
                </TextField>
              </Box>
              <Box>
                {
                  selectedCollectionLinkField &&
                  <Box display="flex"><Typography sx={classes.fieldTypeText}><FormattedMessage {...messages.linkField} />&nbsp;</Typography>{selectedCollectionLinkField}</Box>
                }
                <Typography sx={classes.fieldTypeText}><FormattedMessage {...messages.relationType} /></Typography>
                <Box display="flex">
                  <One2One
                    sx={classes.relationIcon}
                    color={selectedRelationIcon === 'ONE_WAY_ARROW' ? '#FA6401' : '#000000'}
                    onClick={() => {
                      if (editdata?.fieldData?.id)
                        return
                      setSelectedRelationType('ONE')
                      setSelectedRelationBackType('MANY')
                      setSelectedRelationIcon('ONE_WAY_ARROW')
                    }}
                  />
                  <OneOnlyOne
                    sx={classes.relationIcon}
                    color={selectedRelationIcon === 'ONE_WAY_LINE' ? '#FA6401' : '#000000'}
                    onClick={() => {
                      if (editdata?.fieldData?.id)
                        return
                      setSelectedRelationType('ONE')
                      setSelectedRelationBackType('ONE')
                      setSelectedRelationIcon('ONE_WAY_LINE')
                    }}
                  />
                  <One2Many
                    sx={classes.relationIcon}
                    color={selectedRelationIcon === 'ONE_MULTI_ARROW' ? '#FA6401' : '#000000'}
                    onClick={() => {
                      if (editdata?.fieldData?.id)
                        return
                      setSelectedRelationType('MANY')
                      setSelectedRelationBackType('MANY')
                      setSelectedRelationIcon('ONE_MULTI_ARROW')
                    }}
                  />
                  <Many2One
                    sx={classes.relationIcon}
                    color={selectedRelationIcon === 'MULTI_ONE_ARROW' ? '#FA6401' : '#000000'}
                    onClick={() => {
                      if (editdata?.fieldData?.id)
                        return
                      setSelectedRelationType('ONE')
                      setSelectedRelationBackType('MANY')
                      setSelectedRelationIcon('MULTI_ONE_ARROW')
                    }}
                  />
                  <Many2Many
                    sx={classes.relationIcon}
                    color={selectedRelationIcon === 'MULTI_MULTI_ARROW' ? '#FA6401' : '#000000'}
                    onClick={() => {
                      if (editdata?.fieldData?.id)
                        return
                      setSelectedRelationType('MANY')
                      setSelectedRelationBackType('MANY')
                      setSelectedRelationIcon('MULTI_MULTI_ARROW')
                    }}
                  />
                </Box>
                {
                  selectedCollectionDetails &&
                  (
                    {
                      'ONE_WAY_ARROW':
                        <Box display="flex" marginY="10px">
                          <Typography sx={classes.lightLabel}>{collectionTypeName}</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>has one</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>{selectedCollectionDetails.entity_name}</Typography>
                        </Box>,
                      'ONE_WAY_LINE':
                        <Box display="flex" marginY="10px">
                          <Typography sx={classes.lightLabel}>{collectionTypeName}</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>has and belong to one</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>{selectedCollectionDetails.entity_name}</Typography>
                        </Box>,
                      'ONE_MULTI_ARROW':
                        <Box display="flex" marginY="10px">
                          <Typography sx={classes.lightLabel}>{collectionTypeName}</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>belong to many</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>{selectedCollectionDetails.entity_name}</Typography>
                        </Box>,
                      'MULTI_ONE_ARROW':
                        <Box display="flex" marginY="10px">
                          <Typography sx={classes.lightLabel}>{selectedCollectionDetails.entity_name}</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>has many</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>{collectionTypeName}</Typography>
                        </Box>,
                      'MULTI_MULTI_ARROW':
                        <Box display="flex" marginY="10px">
                          <Typography sx={classes.lightLabel}>{collectionTypeName}</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>has and belong to many</Typography>
                          &nbsp;
                          <Typography sx={classes.lightLabel}>{selectedCollectionDetails.entity_name}</Typography>
                        </Box>
                    }[selectedRelationIcon]
                  )
                }
              </Box>
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

CollectionTypeAddRelationField.propTypes = {
  handleClose: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  fieldType: PropTypes.string.isRequired,
  fieldTypeName: PropTypes.string.isRequired,
};

export default CollectionTypeAddRelationField;
