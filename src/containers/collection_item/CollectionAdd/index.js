/**
 *
 * CollectionAdd
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import styles from './styles'
import messages from './messages';
import { TextFieldOverridden as TextField } from '../../../components/TextFieldOverridden/index';
import { Box, MenuItem, Button, Typography, Paper } from '@mui/material';
import { LanguageOutlined } from '@mui/icons-material';
import LoadingOverlay from 'react-loading-overlay';
import CollectionItem from '../../../components/CollectionItem';
import CollectionTypesService from '../../../Api/Services/collection/collectionTypesService';
import { getFieldValueFromResObj, validateDataLoss } from '../../../Api/Services/collection/collectionUtilityServices';
import CollectionItemsService from '../../../Api/Services/collection/collectionItemsService';
import topbar from 'topbar';
import CryptoJS from 'crypto-js'
import { useSelector } from 'react-redux';
import { useAppContext } from '../../../context/AppContext';

export function CollectionAdd(props) {

  const { selectedCollection, languageList, setListOrAdd, editObj, otherItemsList } = props
  const { selectedProject } = useAppContext();

  const classes = styles;

  const [loading, SetLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [fieldMap, setFieldMap] = useState()
  const [fieldValues, setFieldValues] = useState({})
  const [fieldSetMap, setFieldSetMap] = useState({})
  const [fieldSetFetchingDone, setFieldSetFetching] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [validateTriggered, setValidateTrigerred] = useState(false)
  const [backupPayload, setBackupPayload] = useState()

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
  }

  const fetchFieldSetDisplayConf = async (fieldSetIds) => {
    const tempObj = { ...fieldSetMap }
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    try {
      for (const idObj of fieldSetIds) {
        const res = await CollectionTypesService.getFieldSetConfiguration(accID, subscriptionId, subscriberId, idObj.fieldSetId)
        tempObj[idObj.fieldPattern] = res.data
      }
      setFieldSetMap(tempObj)
    }
    catch (err) {
      console.log("error occured in  fetchFieldSetDisplayConf Fnc", err)
    }
    finally {
      setFieldSetFetching(true)
    }
  }

  useEffect(() => {
    if (selectedCollection) {
      const tempObj = {}
      const fieldSetIds = []
      selectedCollection.fields_list.forEach(field => {
        if (field.field_type === "component")
          fieldSetIds.push({ fieldPattern: field.field_path_pattern, fieldSetId: field.settings.selected_fieldset || field.reference_id })
        tempObj[field.field_path_pattern] = field
      })
      setFieldMap({ ...tempObj })
      fetchFieldSetDisplayConf(fieldSetIds)
    }
  }, [])

  useEffect(() => {
    if (editObj) {
      const { fieldListFromAPI, item_meta_details, id, __auto_id__, tableData, entity_status, ...payload } = editObj
      setBackupPayload(JSON.parse(JSON.stringify(payload)))
    }
  }, [editObj])

  const handleErrorCode = (err) => {
    switch (err.code) {
      default:
        return err.message
    }
  }

  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
      else if ("schema_errors" in err.response.data)
        props.tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error')
      else if ("message" in err.response.data) {
        if (typeof err.response.data.message === 'object' && "code" in err.response.data.message)
          props.tostAlert(handleErrorCode(err.response.data.message), 'error')
        else
          props.tostAlert(err.response.data.message, 'error')
      }
      else
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
    }
    else {
      if (err.message === "Network Error")
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
    }
  }

  const modifyCollection = async (skipRedirect) => {
    setValidateTrigerred(true)
    const validateIndex = Object.values(fieldErrors).findIndex(x => x != null && x !== '')
    if (validateIndex > -1) {
      console.log("There are some errors in fields", fieldErrors)
      props.tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error')
      return false
    }
    if (!skipRedirect) {
      SetLoading(true)
      topbar.show()
    }

    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const collectionItemId = editObj.__auto_id__
    const singularId = selectedCollection.api_singular_id
    const version = selectedCollection.version
    const updateKey = editObj.update_key
    const rndInt = parseInt(Math.floor(Math.random() * 99) + 1)
    const hashNumber = parseInt(updateKey) + rndInt
    const hashCode = CryptoJS.SHA256(hashNumber).toString();

    const schemaId = selectedProject.payload.__auto_id__

    const fieldValuesUpdated = []
    const resObjinJSON = {
      collection_item: {}
    }

    for (const key in fieldValues) {
      resObjinJSON.collection_item[key] = fieldValues[key]
    }
    const validateDataLossStatus = validateDataLoss(resObjinJSON.collection_item, backupPayload)
    if (validateDataLossStatus === false) {
      const confirmStatus = window.confirm("Some of the data in current version will be lost. Do you wish to continue ?")
      if (confirmStatus == false) {
        SetLoading(false)
        topbar.hide()
        return false
      }
    }
    editObj.fieldListFromAPI.forEach(field => {
      if (field.path !== '$.id' && field.path !== '$.__auto_id__') {
        const pathStack = field.path.replace("$.", "").split(".")
        const value = getFieldValueFromResObj(resObjinJSON.collection_item, pathStack)
        if (value !== "__SKIP__FIELD___")
          fieldValuesUpdated.push({
            path: field.path,
            value: value ?? ''
          })
      }
      else {
        fieldValuesUpdated.push({
          path: field.path,
          value: field.value
        })
      }
    })
    const resObj = {
      id: collectionItemId,
      fields: fieldValuesUpdated
    }
    try {
      const res = await CollectionItemsService.updateCollectionItemBySingularId(accID, accID, singularId, version, schemaId, collectionItemId, resObj, hashNumber, hashCode)
      if (!skipRedirect) {
        props.tostAlert(<FormattedMessage {...messages.collectionItemModified} />, 'success')
        setListOrAdd('list')
      }
    }
    catch (err) {
      console.log("Error occured while modifying collection item", err)
      apiErrorHandler(err)
    }
    finally {
      if (!skipRedirect) {
        SetLoading(false)
        topbar.hide()
      }
    }
  }

  const saveCollectionItem = async (skipRedirect) => {
    setValidateTrigerred(true)
    const validateIndex = Object.values(fieldErrors).findIndex(x => x != null && x !== '')
    if (validateIndex > -1) {
      console.log("There are some errors in fields", fieldErrors)
      props.tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error')
      return false
    }
    if (!skipRedirect) {
      SetLoading(true)
      topbar.show()
    }

    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const pluralId = selectedCollection.api_prural_id
    const version = selectedCollection.version
    const schemaId = selectedProject.payload.__auto_id__
    const resObj = {
      collection_item: {}
    }
    for (const key in fieldValues) {
      resObj.collection_item[key] = fieldValues[key]
    }
    try {
      const res = await CollectionItemsService.createCollectionItemBySingularId(accID, accID, pluralId, version, schemaId, resObj)
      if (!skipRedirect) {
        props.tostAlert(<FormattedMessage {...messages.collectionItemSaved} />, 'success')
        setListOrAdd('list')
      }
    }
    catch (err) {
      console.log("Error occured while saving collection item", err)
      apiErrorHandler(err)
    }
    finally {
      if (!skipRedirect) {
        SetLoading(false)
        topbar.hide()
      }
    }
  }

  const publishCollectionItem = async () => {
    setValidateTrigerred(true)
    SetLoading(true)
    topbar.show()
    let collectionItemId

    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const collectionId = selectedCollection.id
    try {
      if (editObj) {
        const resInitial = await modifyCollection(true)
        collectionItemId = editObj.__auto_id__
      }
      else {
        const resInitial = await saveCollectionItem(true)
        collectionItemId = resInitial.data.id
      }
      const resPublish = await CollectionItemsService.publishCollectionItem(accID, subscriptionId, subscriberId, collectionId, collectionItemId)
      props.tostAlert(<FormattedMessage {...messages.collectionItemPublished} />, 'success')
      setListOrAdd('list')
    }
    catch (err) {
      console.log("Error occured while publishing collection item", err)
      apiErrorHandler(err)
    }
    finally {
      SetLoading(false)
      topbar.hide()
    }
  }

  const validateUniqueness = (event, selectLang) => {
    if (!event.target.value)
      return
    let searchArr = [...otherItemsList]
    if (editObj)
      searchArr = otherItemsList.filter(x => x.__auto_id__ !== editObj.__auto_id__)
    let indx = -1
    if (selectLang == null)
      indx = searchArr.findIndex(x => x[event.target.name] === event.target.value)
    else
      indx = searchArr.findIndex(x => {
        if (x[event.target.name] != null && [event.target.name] != "" && selectLang in x[event.target.name])
          return x[event.target.name][selectLang] === event.target.value
        return false
      })
    if (indx > -1) {
      setValidateTrigerred(true)
      if (selectLang)
        setFieldErrors(prev => {
          if (prev[event.target.name] != null && prev[event.target.name] !== "")
            return ({
              ...prev,
              [event.target.name]: {
                ...prev[event.target.name],
                [selectLang]: <FormattedMessage {...messages.fieldShoulfBeUnique} />
              }
            })
          return ({
            ...prev,
            [event.target.name]: {
              [selectLang]: <FormattedMessage {...messages.fieldShoulfBeUnique} />
            }
          })
        })
      else
        setFieldErrors(prev => ({
          ...prev,
          [event.target.name]: <FormattedMessage {...messages.fieldShoulfBeUnique} />
        }))
    }
    else {
      if (selectLang) {
        setFieldErrors(prev => {
          const currErr = prev[event.target.name]
          if (currErr && typeof currErr === "object") {
            delete currErr[selectLang]
            if (Object.keys(currErr).length === 0)
              currErr = null
          }
          return ({
            ...prev,
            [event.target.name]: currErr
          })
        })
      }
      else {
        setFieldErrors(prev => ({
          ...prev,
          [event.target.name]: null
        }))
      }
    }
  }

  return (
    <Box width="100%">
      <LoadingOverlay
        active={loading}
        horizontal
        styles={{
          wrapper: {
            height: '100%',
            width: '100%',
          },
          overlay: (base) => ({
            ...base,
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: 1600,
            height: '100%',
            position: 'fixed'
          }),
        }}>
        <Box sx={classes.breadButtonsBox}>
          <Button
            disableElevation
            size="small"
            variant="contained"
            sx={classes.saveBtn}
            onClick={editObj ? modifyCollection.bind(this, false) : saveCollectionItem.bind(this, false)}
          >
            <FormattedMessage {...messages.save} />
          </Button>
          {
            editObj
            &&
            <Button
              disableElevation
              size="small"
              variant="contained"
              sx={classes.publishBtn}
              onClick={publishCollectionItem}
            >
              <FormattedMessage {...messages.publish} />
            </Button>
          }
        </Box>

        <Box display="flex" width="100%" pt={2} justifyContent="center">
          <Box display="flex" flexDirection="column" justifyContent="center" width="85%" maxWidth="960px">
            {
              selectedCollection && selectedCollection.enable_localization
                ?
                <Box display="flex" alignItems="center" width="100%">
                  <LanguageOutlined />
                  <Box width="150px" marginLeft="10px">
                    <TextField
                      variant="filled"
                      label=""
                      margin="normal"
                      name="language"
                      fullWidth
                      size="small"
                      select
                      id="language"
                      onChange={handleLanguageChange}
                      value={selectedLanguage}
                    >
                      {
                        languageList.map(lang => <MenuItem value={lang.value}>{lang.name}</MenuItem>)
                      }
                    </TextField>
                  </Box>
                </Box>
                :
                ''
            }
            {
              editObj && editObj.item_meta_details
                ?
                <Box>
                  <Box display="flex" alignItems="center" width="100%" marginLeft="10px" marginBottom="10px">
                    <Typography sx={classes.smallBold}><FormattedMessage {...messages.status} /></Typography>
                    &nbsp;
                    &nbsp;
                    <Typography sx={classes.smallLight}>{editObj.item_meta_details.entity_status}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" width="100%" marginLeft="10px">
                    <Typography sx={classes.smallBold}><FormattedMessage {...messages.currentVersion} /></Typography>
                    &nbsp;
                    &nbsp;
                    <Typography sx={classes.smallLight}>{parseInt(editObj.item_meta_details.payload_version) + 1}</Typography>
                  </Box>
                </Box>
                :
                ''
            }
            <Paper sx={classes.paper} elevation={0}>
              {
                fieldMap && fieldSetFetchingDone && selectedCollection?.display_view_config?.edit?.default_view?.rows
                  ?
                  selectedCollection.display_view_config.edit.default_view.rows.map((row, rowIndex) =>
                    <Box display="flex" width="100%" maxWidth="960px" key={"outer_view_row_key_" + rowIndex}>
                      {
                        row.sections && row.sections.length
                          ?
                          row.sections.map((col, colIndex) =>
                            <Box display="flex" width="100%" marginX="10px" key={"inner_view_col_key_" + rowIndex + "_" + colIndex}>
                              {
                                fieldMap && fieldMap[col.field_path_pattern] && col.field_path_pattern !== "$.__auto_id__"
                                  ?
                                  <CollectionItem
                                    entity={fieldMap[col.field_path_pattern]}
                                    validateUniqueness={validateUniqueness}
                                    validateTriggered={validateTriggered}
                                    fieldErrors={fieldErrors}
                                    setFieldErrors={setFieldErrors}
                                    selectedLanguage={selectedLanguage}
                                    fieldValues={fieldValues}
                                    setFieldValues={setFieldValues}
                                    entityExtraData={fieldSetMap[col.field_path_pattern] ?? null}
                                    selectedUser={props.selectedUser}
                                    editVal={editObj && fieldMap[col.field_path_pattern] ? editObj[fieldMap[col.field_path_pattern].field_name] : null}
                                    languageList={languageList}
                                    setSelectedLanguage={setSelectedLanguage}
                                    isLocalEnable={selectedCollection && selectedCollection.enable_localization}
                                  />
                                  :
                                  ''
                              }
                            </Box>
                          )
                          :
                          ''
                      }
                    </Box>
                  )
                  :
                  ''
              }
            </Paper>
          </Box>
        </Box>

      </LoadingOverlay>
      {/* </form> */}
    </Box>
  );
}

CollectionAdd.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(CollectionAdd);
