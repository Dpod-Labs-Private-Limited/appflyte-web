/**
 *
 * CollectionTypeAdd
 *
 */

import React, { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Prompt } from 'react-router-dom';
import styles from './styles';
import './style.css';
import { Box, Typography, Button, Paper, MenuItem, Modal, FormControlLabel, Checkbox, RadioGroup, Radio, Menu, IconButton } from '@mui/material';
import { TextFieldOverridden as TextField } from '../../../components/TextFieldOverridden/index';
import LoadingOverlay from 'react-loading-overlay';
import MaterialTable, { MTableEditRow } from 'material-table';
import { tableOptions, tableHeaderStyle } from './tableCommonStyle';
import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, LanguageOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import CloneOutline from '../../../icons/cloneIcon.js'
import CollectionDeleteWarning from '../../../components/CollectionDeleteWarning';
import messages from './messages';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CollectionTypeIcon from '../../../components/CollectionTypeIcon';
import CollectionFieldTypeModal from '../../../components/CollectionFieldTypeModal';
import CollectionTypesService from '../../../Api/Services/collection/collectionTypesService';
import { COLLECTION_FIELD_NAME } from '../../../utils/constants';
import topbar from 'topbar';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import EnhancedCustomTable from '../../../components/EnhancedCustomTable/index.js';
import { useAppContext } from '../../../context/AppContext.js';
import { useOutletContext } from 'react-router-dom';



const StyledEditRow = styled(MTableEditRow)(({ theme }) => ({
  // Styling the h6 element inside MTableEditRow
  "& h6": {
    fontSize: "larger",
    fontWeight: 400,
    color: "red",
  },
}));

export function CollectionTypeAdd() {
  const classes = styles;
  const { selectedProject } = useAppContext();
  const { tostAlert, selectedUser, location, navigate, collectionTypeList, fieldSetListPublished, fetchCollectionTypes, fieldSetList } = useOutletContext();

  useEffect(() => {
    console.log("location", location)
  }, [location])

  const [loading, SetLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [editRowData, setEditRowData] = useState()
  const [modalEdit, setModalEdit] = useState(false)

  const [publishStatus, setPublishStatus] = useState(location?.state?.collTypeObj?.entity_status ?? "Draft")
  const [savedCollTypeId, setSavedCollTypeId] = useState(location.state?.collTypeObj?.id ?? null)
  const [collectionTypeName, setCollectionTypeName] = useState(location.state?.collTypeObj?.entity_name ?? '')
  const [collectionSingularId, setCollectionSingularId] = useState(location.state?.collTypeObj?.api_singular_id ?? '')
  const [collectionPluralId, setCollectionPluralId] = useState(location.state?.collTypeObj?.api_prural_id ?? '')

  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isLocalEnable, setIsLocalEnable] = useState(location.state?.collTypeObj?.enable_localization ?? false)
  const [reqAuthToken, setReqAuthToken] = useState(location.state?.collTypeObj?.requires_authorization_token ? 'protected' : 'public')
  const [isPublishable, setIsPublishable] = useState(location.state?.collTypeObj?.collection_item_publishable ?? false)
  const [error, setError] = useState({})
  const [saveFlag, setSaveFlag] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);

  const [warningModel, setWarningModel] = useState(false)
  const [warningData, setWarningData] = useState()

  const [languageList, setLanguageList] = useState([{
    "name": "English",
    "value": "en"
  },])
  const [languageMasterList, setLanguageMasterList] = useState()
  const [fieldTypeList, setFieldTypeList] = useState([])
  const [existingFields, setExistingFields] = useState([])
  const [fieldNames, setFieldNames] = useState([])
  const [fields, setFields] = useState({
    columns: [
      {
        field: 'typeIndicator', width: '100px', filtering: false, editable: 'never',
        render: rowData => <CollectionTypeIcon type={rowData.fieldData.field_type} />
      },
      { title: 'Name', field: 'name' },
      { title: 'Display Name', field: 'fieldName' },
      { title: 'Type', field: 'fieldType' },
    ],
    data: []
  })

  const fetchCollectionDetails = (savedId) => {
    SetLoading(true)
    topbar.show()

    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const collectionId = savedId ?? location.state?.collTypeObj.id
    const fieldMap = {}

    fieldTypeList.forEach(type => { fieldMap[type.id] = type.type })

    CollectionTypesService
      .getCollectionTypesByIdForCoach(accID, subscriptionId, subscriberId, collectionId)
      .then(res => {

        const existingFieldsList = []
        const fieldsList = []
        const fieldNames = []

        console.log("res.data", res.data)

        res.data.fields.forEach((field, index) => {
          if (field.entity_name === "__auto_id__")
            return false
          const fieldData = {
            id: field.id,
            name: field.entity_name,
            field_type: field.field_type,
            field_sub_type: field.field_sub_type,
            localized_texts: field.localized_texts,
            field_settings: field.field_settings
          }
          existingFieldsList.push(fieldData)
          fieldsList.push({
            index,
            fieldName: isLocalEnable ? field.localized_texts[selectedLanguage] ?? '-' : field.localized_texts?.en ?? field.entity_name,
            fieldType: fieldMap[field.field_type],
            name: field.entity_name,
            fieldData
          })
          fieldNames.push(field.entity_name)
        })

        setExistingFields(existingFieldsList)
        setFields({ columns: [...fields.columns], data: fieldsList })
        setFieldNames(fieldNames)

      })
      .catch(err => {
        console.log("Error occured while fetching collection type by id list for a coach", err)
      })
      .finally(() => {
        SetLoading(false)
        topbar.hide()
      })
  }

  useEffect(() => {
    topbar.show()
    SetLoading(true)
    CollectionTypesService
      .getSupportedLanguages()
      .then(res => {
        setLanguageMasterList(res.data)
      })
      .catch(err => {
        console.log("Error occured while fetching supportedFieldTypes", err)
      })
      .finally(() => {
        // SetLoading(false)
        // topbar.hide()
      })
    CollectionTypesService
      .getSupportedFieldTypes()
      .then(res => {
        setFieldTypeList(res.data)
      })
      .catch(err => {
        console.log("Error occured while fetching supportedFieldTypes", err)
      })
      .finally(() => {
        SetLoading(false)
        topbar.hide()
      })
  }, [selectedUser])

  useEffect(() => {
    if (fields && languageMasterList) {
      const langSet = new Set()
      fields.data.forEach(field => {
        Object.keys(field.fieldData.localized_texts).forEach(lang => {
          langSet.add(lang)
        })
      })
      const filteredLanguageList = languageMasterList.filter(x => langSet.has(x.value))
      if (filteredLanguageList.length === 0)
        setLanguageList([{
          name: 'English',
          value: 'en'
        }])
      else
        setLanguageList(filteredLanguageList)
    }
  }, [fields, languageMasterList])

  useEffect(() => {
    if (location.state?.collTypeObj && selectedUser && fieldTypeList && fieldTypeList.length > 0) {
      fetchCollectionDetails()
    }
  }, [location.state && selectedUser && fieldTypeList])

  const handleTypeNameChange = (event) => {
    setSaveFlag(true)
    setCollectionTypeName(event.target.value)
    const singularIdText = event.target.value.trim().replaceAll(" ", "-").toLowerCase()
    const pluralIdText = event.target.value.trim().replaceAll(" ", "-").toLowerCase() + "s"
    setCollectionSingularId(singularIdText)
    setCollectionPluralId(pluralIdText)
  }
  const handleSingularIdChange = (event) => {
    setSaveFlag(true)
    setCollectionSingularId(event.target.value)
  }
  const handlePluralIdChange = (event) => {
    setSaveFlag(true)
    setCollectionPluralId(event.target.value)
  }

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
    const changedLangData = fields.data.map(item =>
    ({
      ...item,
      fieldName: item.fieldData.localized_texts ? (
        item.fieldData.localized_texts[event.target.value] ?? '-'
      ) : item.fieldData.name
    })
    )
    setFields({
      columns: [...fields.columns],
      data: changedLangData
    })
  }

  const handleOpen = (isEdit, rowData) => {
    setSaveFlag(true)
    setModalEdit(isEdit);
    if (isEdit)
      setEditRowData(rowData)
    else
      setEditRowData()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorModelOpen = () => {
    setWarningModel(true)
  }

  const handleErrorModelClose = () => {
    setWarningModel(false)
    setWarningData()
  }

  const handleLocalCheckboxChanged = () => {
    setSaveFlag(true)
    setIsLocalEnable(prevState => !prevState)
  }

  const handlePublishCheckboxChanged = () => {
    setIsPublishable(prevState => !prevState)
  }

  const handleReqTokenCheckboxChanged = () => {
    setReqAuthToken(prevState => !prevState)
  }

  const updateIndexOnDelete = updatedData => updatedData.map((item, i) => ({ ...item, index: i }))

  const computeAddUpdateDelete = () => {
    const add = []
    const modify = []
    const listOfIds = []
    const remove = []
    fields.data.forEach(field => {
      if (field.fieldData.id) {
        const tmpObj = {
          id: field.fieldData.id,
          localized_texts: field.fieldData.localized_texts,
          field_sub_type: field.fieldData.field_sub_type,
          field_settings: { ...field.fieldData.field_settings },
        }
        // if ("is_mandatory" in field.fieldData.field_settings)
        //   tmpObj.field_settings.is_mandatory = field.fieldData.field_settings.is_mandatory
        // if ("is_unique" in field.fieldData.field_settings)
        //   tmpObj.field_settings.is_unique = field.fieldData.field_settings.is_unique
        // if ("is_private" in field.fieldData.field_settings)
        //   tmpObj.field_settings.is_private = field.fieldData.field_settings.is_private
        // tmpObj.field_settings = { ...field.fieldData.field_settings }
        modify.push(tmpObj)
        listOfIds.push(field.fieldData.id)
      }
      else {
        const { id, ...restData } = field.fieldData
        add.push(restData)
      }
    })
    existingFields.forEach(x => {
      if (!listOfIds.includes(x.id))
        remove.push({
          id: x.id
        })
    })
    return { add, modify, remove }
  }

  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
      else if ("schema_errors" in err.response.data)
        tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error')
      else if ("message" in err.response.data)
        tostAlert(err.response.data.message, 'error')
      else
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
    }
    else {
      if (err.message === "Network Error")
        tostAlert(<FormattedMessage {...messages.serverError} />, 'error')
    }
  }

  const validate = () => {
    const errors = {}
    if (collectionTypeName == null || collectionTypeName === '')
      errors.collectionName = <FormattedMessage {...messages.nameReq} />
    if (collectionSingularId == null || collectionSingularId === '')
      errors.collectionSingularId = <FormattedMessage {...messages.collectionSingularIdReq} />
    if (collectionPluralId == null || collectionPluralId === '')
      errors.collectionPluralId = <FormattedMessage {...messages.collectionPluralIdReq} />
    setError(errors)
    if (Object.keys(errors).length === 0)
      return true
    return false
  }

  const createCollectionType = (callbackFnc) => {
    if (validate() === false)
      return false
    SetLoading(true)
    topbar.show()
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const schemaId = selectedProject.payload.__auto_id__
    const resObj = {
      is_new: true,
      account_id: accID,
      request_parameters: {
        name: collectionTypeName,
        api_singular_id: collectionSingularId,
        api_prural_id: collectionPluralId,
        is_repeatable: true,
        enable_localization: isLocalEnable,
        requires_authorization_token: reqAuthToken === 'protected',
        // collection_item_publishable: isPublishable,
        collection_item_publishable: true,
        localized_texts: { en: collectionTypeName },
        schema_id: schemaId
      }
    }
    CollectionTypesService.createNewCollectionType(accID, subscriptionId, subscriberId, resObj)
      .then(res => {
        setSaveFlag(false)
        setPublishStatus("Draft")
        setSavedCollTypeId(res.data.id)
        if (callbackFnc == null) {
          fetchCollectionTypes()
          tostAlert(<FormattedMessage {...messages.successfullySaved} />, 'success')
        }
        else
          callbackFnc(res.data.id);
      })
      .catch(err => {
        console.log('Error occured while saving collection type', err)
        apiErrorHandler(err)
      })
      .finally(() => {
        SetLoading(false)
        topbar.hide()
      })
  }

  const updateCollectionFields = (callbackFnc, collID) => {
    SetLoading(true)
    topbar.show()
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const resObj = computeAddUpdateDelete()
    // resObj.request_parameters = {
    //   name: collectionTypeName,
    //   api_singular_id: collectionSingularId,
    //   api_prural_id: collectionPluralId,
    // }
    const savedID = collID ?? savedCollTypeId
    CollectionTypesService
      .updateCollectionFields(accID, subscriptionId, subscriberId, savedID, resObj)
      .then(res => {
        setSaveFlag(false)
        setPublishStatus("Draft")
        if (callbackFnc == null) {
          tostAlert(<FormattedMessage {...messages.successfullySaved} />, 'success')
          fetchCollectionDetails(savedID)
          fetchCollectionTypes()
        }
        else
          callbackFnc(savedID);
      })
      .catch(err => {
        console.log('Error occured while saving collection type', err)
        apiErrorHandler(err)
      })
      .finally(() => {
        if (callbackFnc == null) {
          SetLoading(false)
          topbar.hide()
        }
      })
  }

  const publishCollectionType = (collID) => {
    SetLoading(true)
    topbar.show()

    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id

    CollectionTypesService
      .publishCollectionType(accID, subscriptionId, subscriberId, collID)
      .then(res => {
        setSaveFlag(false)
        // fetchCollectionDetails()
        fetchCollectionTypes()
        tostAlert(<FormattedMessage {...messages.successfullypublished} />, 'success')
        const currentPath = location.pathname
        if (currentPath.charAt(currentPath.length - 1) === '/') {
          navigate(
            currentPath + "configure",
            {
              state: {
                context: 'collectionType',
                publishedCollId: res.data.id,
                editName: location.state?.editName,
                lastHistoryObj: {
                  ...location.state
                }
              }
            })
        } else {
          navigate(
            currentPath + "/configure",
            {
              state: {
                context: 'collectionType',
                publishedCollId: res.data.id,
                editName: location.state?.editName,
                lastHistoryObj: {
                  ...location.state
                }
              }
            })
        }

      })
      .catch(err => {
        console.log('Error occured while saving collection type', err)
        apiErrorHandler(err)
      })
      .finally(() => {
        SetLoading(false)
        topbar.hide()
      })
  }

  const publishValidate = () => {
    for (const field of fields.data) {
      if (!(field.fieldData.field_type === COLLECTION_FIELD_NAME.COMPONENT || field.fieldData.field_type === COLLECTION_FIELD_NAME.RELATION)) {
        return true
      }
    }
    tostAlert(<FormattedMessage {...messages.addNonLinkedField} />, 'error')
    return false
  }

  const getRedirectPathForError = (error, collectionDetails) => {
    switch (error.message.code) {
      case 'CLER34':
      case 'CLER37':
        return error.message.data.map(item => {
          return ({
            name: item.collection.name ?? '',
            path: item.collection.id === savedCollTypeId ? '__HANDLE_CLOSE__' : 'collection-types?redirect_mode=collection&collId=' + item.collection.id
          })
        }
        )
      case 'CLER38':
        return error.message.data.map(item => {
          return ({
            name: item.fieldset.name ?? '',
            path: 'collection-types?redirect_mode=field_set&collId=' + item.fieldset.id
          })
        }
        )
      case 'CLER36':
        return [{
          name: '',
          path: 'collection-types?redirect_mode=field_set&collId=' + collectionDetails.id
        }]
      case 'CLER35':
        return [
          {
            name: '',
            path: "collections/" + collectionDetails.api_singular_id
          }
        ]
      default:
        return []
    }
  }

  const deleteCollectionType = async () => {
    const selectedRowDataDetails = [location.state?.collTypeObj]
    SetLoading(true)
    topbar.show()
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const warningNames = {}
    const errorNames = []
    const successNames = []
    let defError = null
    for (const coll of selectedRowDataDetails) {
      const collId = coll.id
      try {
        const res = await CollectionTypesService.deleteCollectionType(accID, subscriptionId, subscriberId, collId)
        if (res.data.success)
          successNames.push(coll.entity_name)
      }
      catch (err) {
        if (err.response.status === 422 && err.response.data.message && err.response.data.message.code) {
          if (err.response.data.message.code in warningNames)
            warningNames[err.response.data.message.code].push({
              collectionName: coll.entity_name,
              errorCode: err.response.data.message.code,
              defaultMessage: err.response.data.message.message,
              redirectPath: getRedirectPathForError(err.response.data, coll)
            })
          else
            warningNames[err.response.data.message.code] = [({
              collectionName: coll.entity_name,
              errorCode: err.response.data.message.code,
              defaultMessage: err.response.data.message.message,
              redirectPath: getRedirectPathForError(err.response.data, coll)
            })]
        }
        else {
          errorNames.push(coll.entity_name)
          if (err.response.data.message)
            defError = err.response.data.message.message
        }
      }
    }
    fetchCollectionTypes()
    SetLoading(false)
    topbar.hide()
    if (Object.keys(warningNames).length === 0) {
      if (errorNames.length === 0) {
        tostAlert(<FormattedMessage {...messages.successfullyDeletedAll} />, 'success')
        handleCloseMenu()
        navigate(-1)
        return
      }
      else if (successNames.length === 0) {
        console.log("came here", defError)
        tostAlert(defError ?? <FormattedMessage {...messages.errorfullyDeletedAll} />, 'error')
        handleCloseMenu()
        return
      }
    }
    setWarningData({
      successNames,
      warningNames,
      errorNames,
      context: 'collection'
    })
    handleErrorModelOpen()
    handleCloseMenu()
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClipboardCopy = (apiID) => {
    const finalUrl = window.__ENV__?.REACT_APP_COLLECTION_API_BASE_URL ? window.__ENV__.REACT_APP_COLLECTION_API_BASE_URL : process.env.REACT_APP_COLLECTION_API_BASE_URL + selectedUser.root_account_id + "/api/collection/" + location.state?.collTypeObj.account_id + "/user/private/cm/v" + location.state?.collTypeObj.latest_published_version + "/" + apiID
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = finalUrl;  // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
  }

  return (
    <Box sx={classes.mainContainer}>
      <Box sx={classes.cardContainer}>

        <Box sx={classes.breadButtonsBox}>
          <Button
            disableElevation
            variant='outlined'
            sx={{ ...classes.cancelBtn }}
            onClick={() => {
              navigate(-1)
            }}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            disableElevation
            variant='contained'
            size="small"
            sx={classes.saveDraftBtn}
            onClick={
              () => {
                if (savedCollTypeId == null) {
                  createCollectionType((collID) => {
                    updateCollectionFields(null, collID)
                  })
                }
                else
                  updateCollectionFields(null, null)
              }
            }
          >
            <FormattedMessage {...messages.saveDraft} />
          </Button>
          <Button
            disableElevation
            variant='contained'
            size='small'
            sx={classes.uploadBtn}
            onClick={() => {
              if (publishValidate()) {
                if (savedCollTypeId == null)
                  createCollectionType((collID) => {
                    updateCollectionFields(publishCollectionType, collID)
                  })
                else
                  updateCollectionFields(publishCollectionType, null)
              }
            }}
          >
            <FormattedMessage {...messages.publish} />
          </Button>
          {savedCollTypeId != null
            ?
            <Box>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="collectionTTypeDetailsMenu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(anchorEl)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                onClose={handleCloseMenu}
              >
                <div>
                  <MenuItem
                    id="deleteCollectionTypeEditScreen"
                    dense={true}
                    sx={classes.moreMenu}
                    onClick={deleteCollectionType}
                  >
                    <FormattedMessage {...messages.deleteCollectionType} />
                  </MenuItem>
                </div>
              </Menu>
            </Box>
            :
            ''
          }
        </Box>

        <LoadingOverlay
          active={loading}
          horizontal
          styles={{
            wrapper: {
              height: '100%',
              width: '100%'
            },
            overlay: (base) => ({
              ...base,
              background: 'rgba(0, 0, 0, 0.2)',
              zIndex: 1600,
              height: '100%',
              position: 'fixed'
            }),
          }}>
          <Box pt={5} display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" justifyContent="center" width="85%" maxWidth="960px">
              <Paper sx={classes.paper} elevation={0}>
                <Box display="flex" flexDirection="column" p={3}>
                  <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.colectionTypes} /></Typography>
                  <TextField
                    error={error.collectionName && error.collectionName !== ''}
                    helperText={(error.collectionName && error.collectionName !== '') ?? ''}
                    name="collectionName"
                    label={<FormattedMessage {...messages.collectionName} />}
                    disabled={location.state && location.state?.collTypeObj && location.state?.collTypeObj.latest_published_entity_id != null}
                    variant='filled'
                    fullWidth
                    margin="normal"
                    size="small"
                    onChange={handleTypeNameChange}
                    value={collectionTypeName}
                  />
                  <Box display="flex" width="100%">
                    <Box width="100%" marginRight="10px">
                      <TextField
                        error={error.collectionSingularId && error.collectionSingularId !== ''}
                        helperText={(error.collectionSingularId && error.collectionSingularId !== '') ?? ''}
                        name="collectionSingularId"
                        label={<FormattedMessage {...messages.collectionSingularId} />}
                        disabled={location && location.state?.collTypeObj && location.state?.collTypeObj.latest_published_entity_id != null}
                        variant='filled'
                        fullWidth
                        margin="normal"
                        size="small"
                        onChange={handleSingularIdChange}
                        value={collectionSingularId}
                      />
                    </Box>
                    <Box width="100%" marginLeft="10px">
                      <TextField
                        error={error.collectionPluralId && error.collectionPluralId !== ''}
                        helperText={(error.collectionPluralId && error.collectionPluralId !== '') ?? ''}
                        name="collectionPluralId"
                        label={<FormattedMessage {...messages.collectionPluralId} />}
                        disabled={location.state && location.state?.collTypeObj && location.state?.collTypeObj.latest_published_entity_id != null}
                        variant='filled'
                        fullWidth
                        margin="normal"
                        size="small"
                        onChange={handlePluralIdChange}
                        value={collectionPluralId}
                      />
                    </Box>
                  </Box>
                  <Box display="flex" marginY="10px">
                    <FormControlLabel
                      size="small"
                      classes={{ label: classes.mediumLabel }}
                      control={
                        <Checkbox
                          size='small'
                          checked={isLocalEnable}
                          disabled={savedCollTypeId != null}
                          onChange={handleLocalCheckboxChanged}
                          name={"isLocalEnable"}
                        />
                      }
                      label={<FormattedMessage {...messages.isLocalReq} />}
                    />
                    {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={isPublishable}
                        disabled={savedCollTypeId != null}
                        onChange={handlePublishCheckboxChanged}
                        name={"isPublishable"}
                      />
                    }
                    label={<FormattedMessage {...messages.isPublishable} />}
                  /> */}
                    {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={reqAuthToken}
                        disabled={savedCollTypeId != null}
                        onChange={handleReqTokenCheckboxChanged}
                        name={"reqAuthToken"}
                      />
                    }
                    label={<FormattedMessage {...messages.reqAuthToken} />}
                  /> */}
                  </Box>
                  <Box marginY="10px">
                    <Typography sx={classes.smallBold}><FormattedMessage {...messages.manageAccess} /></Typography>
                    <RadioGroup aria-label="access" size="small" name="reqAuthToken" row value={reqAuthToken} disabled={savedCollTypeId != null} onChange={(e) => {
                      setSaveFlag(true)
                      setReqAuthToken(e.target.value)
                    }}>
                      <FormControlLabel classes={{ label: classes.mediumLabel }} value={"public"} control={<Radio size="small" />} label={<FormattedMessage {...messages.public} />} />
                      <FormControlLabel classes={{ label: classes.mediumLabel }} value={"protected"} control={<Radio size="small" />} label={<FormattedMessage {...messages.protected} />} />
                    </RadioGroup>
                  </Box>
                  {
                    location.state && location.state?.collTypeObj && location.state?.collTypeObj.latest_published_entity_id != null
                    &&
                    <Box marginY="10px" maxWidth="660px">
                      <Typography sx={classes.smallBold}><FormattedMessage {...messages.apiEndPointLabel} /></Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between" marginY="10px" >
                        <Box display="flex" width="100%">
                          <Box sx={classes.apiBlackBox}>
                            <Typography sx={classes.apiBlackBoxText}><FormattedMessage {...messages.plural} /></Typography>
                          </Box>
                          <Box sx={classes.apiUrlBox}>
                            <Typography noWrap sx={classes.apiLinkText}>
                              {process.env.REACT_APP_COLLECTION_API_BASE_URL}{selectedUser?.root_account_id ?? ''}/api/collection/{location.state?.collTypeObj.account_id}/user/private/cm/v{location.state?.collTypeObj.latest_published_version}/{location.state?.collTypeObj.api_prural_id}
                            </Typography>
                          </Box>
                          <Box
                            sx={classes.apiCopyBox}
                            onClick={handleClipboardCopy.bind(this, location.state?.collTypeObj.api_prural_id)}
                          >
                            <CloneOutline sx={classes.copyIcon} />
                          </Box>
                        </Box>
                        <Box display="flex">
                          <Box sx={classes.getApiBox}><Typography sx={classes.tinyWhite}>GET</Typography></Box>
                          <Box sx={classes.postApiBox}><Typography sx={classes.tinyWhite}>POST</Typography></Box>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" marginY="10px">
                        <Box display="flex" width="100%">
                          <Box sx={classes.apiBlackBox}>
                            <Typography sx={classes.apiBlackBoxText}><FormattedMessage {...messages.singular} /></Typography>
                          </Box>
                          <Box sx={classes.apiUrlBox}>
                            <Typography noWrap sx={classes.apiLinkText}>
                              {window.__ENV__?.REACT_APP_COLLECTION_API_BASE_URL ? window.__ENV__.REACT_APP_COLLECTION_API_BASE_URL : process.env.REACT_APP_COLLECTION_API_BASE_URL}{selectedUser?.root_account_id ?? ''}/api/collection/{location.state?.collTypeObj.account_id}/user/private/cm/v{location.state?.collTypeObj.latest_published_version}/{location.state?.collTypeObj.api_singular_id}/{"{id}"}
                            </Typography>
                          </Box>
                          <Box
                            sx={classes.apiCopyBox}
                            onClick={handleClipboardCopy.bind(this, (location.state?.collTypeObj.api_singular_id + "/{id}"))}
                          >
                            <CloneOutline sx={classes.copyIcon} />
                          </Box>
                        </Box>
                        <Box display="flex">
                          <Box sx={classes.getApiBox}><Typography sx={classes.tinyWhite}>GET</Typography></Box>
                          <Box sx={classes.putApi}><Typography sx={classes.tinyWhite}>PUT</Typography></Box>
                          <Box sx={classes.delApi}><Typography sx={classes.tinyWhite}>DEL</Typography></Box>
                        </Box>
                      </Box>
                    </Box>
                  }
                  {
                    savedCollTypeId != null &&
                    <Box display="flex">
                      <Typography sx={classes.smallBold}><FormattedMessage {...messages.publishStatus} /></Typography>
                      &nbsp;
                      &nbsp;
                      <Typography sx={classes.smallLight}>{publishStatus}</Typography>
                    </Box>
                  }
                  {
                    location.state && location.state?.collTypeObj && location.state?.collTypeObj.latest_published_entity_id != null &&
                    <Box display="flex" marginTop="10px">
                      <Typography sx={classes.smallBold}><FormattedMessage {...messages.publishVersion} /></Typography>
                      &nbsp;
                      &nbsp;
                      <Typography sx={classes.smallLight}>{parseInt(location.state?.collTypeObj.latest_published_version) + 1}</Typography>
                    </Box>
                  }
                </Box>
              </Paper>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" maxWidth="960px" marginBottom="15px" paddingX="20px">
                {
                  // isLocalEnable && savedCollTypeId != null
                  isLocalEnable
                    ?
                    <Box display="flex" alignItems="center">
                      <LanguageOutlined />
                      <Box width="150px" marginX="15px">
                        <TextField
                          name="language"
                          variant='filled'
                          fullWidth
                          margin="normal"
                          select
                          size="small"
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
                    <Box></Box>
                }
                {
                  publishStatus === "Published"
                    ?
                    <Box>
                      <Button
                        disableElevation
                        variant='outlined'
                        color='secondary'
                        size="small"
                        sx={classes.confBtn}
                        onClick={() => {
                          const currentPath = location.pathname
                          if (currentPath.charAt(currentPath.length - 1) === '/') {
                            navigate(
                              currentPath +
                              "/configure",
                              {
                                state: {
                                  context: 'collectionType',
                                  publishedCollId: location.state?.collTypeObj.latest_published_entity_id,
                                  editName: location.state?.editName,
                                  lastHistoryObj: {
                                    ...location.state
                                  }
                                }
                              }
                            )
                          } else {
                            navigate(
                              currentPath +
                              "/configure",
                              {
                                state: {
                                  context: 'collectionType',
                                  publishedCollId: location.state?.collTypeObj.latest_published_entity_id,
                                  editName: location.state?.editName,
                                  lastHistoryObj: {
                                    ...location.state
                                  }
                                }
                              }
                            )
                          }

                        }}
                      >
                        <FormattedMessage {...messages.confView} />
                      </Button>
                    </Box>
                    :
                    ''
                }
              </Box>
              <Paper sx={classes.paper3} elevation={0}>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title-add-collType"
                  aria-describedby="simple-modal-description-add-collType"
                >
                  <CollectionFieldTypeModal
                    isLocalEnable={isLocalEnable}
                    selectedLanguage={selectedLanguage}
                    languageList={languageMasterList}
                    collectionTypeList={collectionTypeList}
                    fieldNames={fieldNames}
                    setFieldNames={setFieldNames}
                    fieldSetList={fieldSetList}
                    fieldSetListPublished={fieldSetListPublished}
                    fieldTypeList={fieldTypeList}
                    selectedUser={selectedUser}
                    setFields={setFields}
                    editdata={editRowData}
                    isRestrictEdit={savedCollTypeId != null}
                    handleClose={handleClose}
                    collectionTypeName={collectionTypeName}
                    tostAlert={tostAlert}
                  />
                </Modal>
                <Box id="fieldListDark">
                  {
                    // savedCollTypeId != null
                    true
                      ?
                      // <MaterialTable
                      //   title={(<Typography sx={classes.relavantTherapiesText}><FormattedMessage {...messages.fields} /></Typography>)}
                      //   icons={tableIcons}
                      //   columns={fields.columns}
                      //   options={{
                      //     headerStyle: tableHeaderStyle,
                      //     ...tableOptions,
                      //   }}
                      //   data={fields.data}
                      //   components={{
                      //     Container: props => <Paper {...props} elevation={0} sx={classes.tableRootPaper} />,
                      //     EditRow: StyledEditRow,
                      //   }}
                      //   localization={{
                      //     header: {
                      //       actions: ""
                      //     },
                      //     body: { editRow: { deleteText: 'Are you sure you want to delete this field ?' } }
                      //   }}
                      //   actions={[
                      //     {
                      //       icon: forwardRef((props, ref) => <AddBox sx={classes.actionIconAdd} {...props} ref={ref} />),
                      //       tooltip: <FormattedMessage {...messages.addField} />,
                      //       isFreeAction: true,
                      //       onClick: (event) => handleOpen(false)
                      //     },
                      //     {
                      //       icon: forwardRef((props, ref) => <Edit sx={classes.actionIcon} {...props} ref={ref} />),
                      //       tooltip: <FormattedMessage {...messages.editField} />,
                      //       onClick: (event, rowData) => handleOpen(true, rowData)
                      //     },
                      //   ]}
                      //   editable={{
                      //     onRowDelete: (oldData) =>
                      //       new Promise((resolve) => {
                      //         setTimeout(() => {
                      //           resolve();
                      //           setSaveFlag(true)
                      //           setFields((prevState) => {
                      //             const data = [...prevState.data];
                      //             data.splice(data.indexOf(oldData), 1);
                      //             const updatedData = updateIndexOnDelete(data)
                      //             return { ...prevState, data: updatedData };
                      //           });
                      //           setFieldNames(prev => {
                      //             const data = [...prev]
                      //             data.splice(prev.indexOf(oldData.name), 1)
                      //             return data
                      //           })
                      //         }, 600);
                      //       }),
                      //   }}
                      // />
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
                          <Typography sx={classes.relavantTherapiesText}><FormattedMessage {...messages.fields} /></Typography>
                          <IconButton color='primary' onClick={() => handleOpen(false)} aria-label="add" size="small" sx={classes.addIcon}>
                            <AddBox />
                          </IconButton>
                        </Box>
                        <EnhancedCustomTable
                          showCheckbox={false}
                          columns={fields.columns}
                          data={fields.data}
                          actions={
                            [
                              {
                                icon: <DeleteOutline />,
                                tooltip: 'Delete',
                                onClick: (event, rowData) => {
                                  setSaveFlag(true)
                                  setFields((prevState) => {
                                    const data = [...prevState.data];
                                    data.splice(data.indexOf(rowData), 1);
                                    const updatedData = updateIndexOnDelete(data)
                                    return { ...prevState, data: updatedData };
                                  });
                                  setFieldNames(prev => {
                                    const data = [...prev]
                                    data.splice(prev.indexOf(rowData.name), 1)
                                    return data
                                  })
                                },
                              },
                            ]
                          }
                        >
                        </EnhancedCustomTable>
                      </Box>
                      :
                      ''
                  }
                </Box>
              </Paper>
            </Box>
          </Box>
        </LoadingOverlay >

        <Modal
          open={warningModel}
          onClose={handleErrorModelClose}
          aria-labelledby="simple-modal-title-del-collType"
          aria-describedby="simple-modal-description-del-collType"
        >
          <CollectionDeleteWarning
            successNames={warningData ? warningData.successNames : []}
            warningNames={warningData ? warningData.warningNames : {}}
            errorNames={warningData ? warningData.errorNames : []}
            context={warningData ? warningData.context : 'collection'}
            successMsg={<FormattedMessage {...messages.succDelete} />}
            warningMsg={<FormattedMessage {...messages.warningDelete} />}
            errorMsg={<FormattedMessage {...messages.errDelete} />}
            handleClose={handleErrorModelClose}
            navigate={navigate}
          />
        </Modal>

      </Box>
    </Box >
  );
}

CollectionTypeAdd.propTypes = {
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

export default compose(withConnect)(CollectionTypeAdd);
