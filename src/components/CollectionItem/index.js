/**
 *
 * CollectionItem
 *
 */

import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles'
import { Box, Typography, Chip, MenuItem, RadioGroup, FormControlLabel, FormControl, Radio, Collapse, FormLabel, Drawer, InputLabel, Select, Autocomplete } from '@mui/material';
import { TextFieldOverridden as TextField } from '../../components/TextFieldOverridden/index';
// import { Autocomplete } from '@mui/lab';
import { PhotoCameraBack, ArrowCircleUp, ArrowCircleDown } from '../../icons/extraIcons';
import { AddBox, CloseOutlined, DeleteOutline } from '@mui/icons-material';
import { getCollectionLabel, getDefaultBooleanValue, getListValuesByLanguage, getMediaTypesForFileInput } from '../../Api/Services/collection/collectionUtilityServices';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker, KeyboardDateTimePicker } from '@material-ui/pickers'
import FieldSetRenderLayout from '../../components/FieldSetRenderLayout';
import SearchAndAddFiles from '../../components/SearchAndAddFiles';
import CollectionItemsService from '../../Api/Services/collection/collectionItemsService';
import DateFnsUtils from '@date-io/date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment-timezone';
import { validate } from 'uuid';
import { FILE_TYPE_DOCUMENT, FILE_TYPE_IMAGE, FILE_TYPE_VIDEO } from '../../utils/constants';
import ImageComponent from '../../components/ImageComponent';
import CollectionTypesService from '../../Api/Services/collection/collectionTypesService';

function CollectionItem(props) {

  const { entity, validateUniqueness, validateTriggered, fieldErrors, setFieldErrors, selectedLanguage, fieldValues,
    setFieldValues, entityExtraData, languageList, editVal, setSelectedLanguage, isLocalEnable } = props


  console.log("entity", entity)
  // return

  const classes = styles;

  const [checkedList, setCheckedList] = useState([])
  const [relationLookUpList, setRelationLookupList] = useState([])
  const [openFileDrawer, setOpenFileDrawer] = useState(false)

  const handleOpenFileDrawer = () => {
    setOpenFileDrawer(true)
  }

  const handleCloseFileDrawer = () => {
    setOpenFileDrawer(false)
  }

  const handleTextValueChange = (event) => {
    setFieldValues(prevValue => ({ ...prevValue, [event.target.name]: event.target.value }))
    if (event.target.actualValue)
      validateSingleField(entity, event.target.actualValue)
    else
      validateSingleField(entity, event.target.value)
  }

  const handleBoolValueChange = (event) => {
    setFieldValues(prevValue => ({ ...prevValue, [event.target.name]: event.target.value === "true" ? true : false }))
    validateSingleField(entity, event.target.value)
  }

  const handleTextValueChangeMultiLanguage = (event) => {
    setFieldValues(prevValue => {
      if (event.target.name in prevValue)
        return ({ ...prevValue, [event.target.name]: { ...prevValue[event.target.name], [selectedLanguage]: event.target.value } })
      return ({ ...prevValue, [event.target.name]: { [selectedLanguage]: event.target.value } })
    })
    if (event.target.actualValue)
      validateSingleField(entity, event.target.actualValue)
    else
      validateSingleField(entity, event.target.value)
  }

  const handleMultiSelectSelected = (event) => {
    setFieldValues(prevValue => {
      if (event.target.name in prevValue) {
        const tempArr = [...prevValue[event.target.name]]
        if (tempArr.includes(event.target.value)) {
          tempArr.splice(tempArr.indexOf(event.target.value), 1)
        }
        else
          tempArr.push(event.target.value)
        return ({ ...prevValue, [event.target.name]: tempArr })
      }
      return ({ ...prevValue, [event.target.name]: [event.target.value] })
    })
  }

  const handleFileSelected = (fileIds, fileDetails) => {
    setFieldValues(prevValue => ({
      ...prevValue,
      [entity.field_name]: prevValue[entity.field_name] && prevValue[entity.field_name].length
        ?
        [
          ...prevValue[entity.field_name],
          ...fileDetails.map(item => ({
            file_type: item.entitySubType,
            thumbnail_url: item.entityThumbnail,
            file_id: item.entityId,
            file_name: item.entityName
          }))
        ]
        :
        fileDetails.map(item => ({
          file_type: item.entitySubType,
          thumbnail_url: item.entityThumbnail,
          file_id: item.entityId,
          file_name: item.entityName
        }))
    }))
    validateSingleField(entity, "DUMMY_TEXT_TO_PASS_VALIDATION")
  }

  const addFieldSetItem = () => {
    setFieldValues(prevValue => {
      let existingFieldSetData = [...prevValue[entity.field_name]]
      if (existingFieldSetData == null)
        existingFieldSetData = []
      existingFieldSetData.push({})
      return ({
        ...prevValue,
        [entity.field_name]: existingFieldSetData
      })
    })
    setCheckedList(prev => ([...prev, false]))
    validateSingleField(entity, "DUMMY_TEXT_TO_PASS_VALIDATION")
  }

  const removeFieldSetItem = (index) => {
    setFieldValues(prevValue => {
      let tmpArr = prevValue[entity.field_name]
      tmpArr.splice(index, 1)
      validateSingleField(entity, tmpArr)
      return ({ ...prevValue, [entity.field_name]: tmpArr })
    })
    setCheckedList(prevValue => {
      let tmpArr = [...prevValue]
      tmpArr.splice(index, 1)
      return tmpArr
    })
  }

  const toggleCollapse = (index) => {
    setCheckedList(prevValue => {
      let tmpArr = [...prevValue]
      tmpArr[index] = !tmpArr[index]
      return tmpArr
    })
  }

  const getRelationLookupName = (linkField, item) => {
    if (!linkField) {
      for (const itemKey in item) {
        if (itemKey !== "id" && itemKey !== "__auto_id__")
          return item[itemKey]
      }
      return item.__auto_id__
    }
    if (linkField.field_type === "list") {
      if (linkField.field_sub_type === "multi")
        return item.__auto_id__
      if (!item[linkField.field_name])
        return item.__auto_id__
      if (!(linkField.settings.field_values))
        return item[linkField.field_name]
      if (!(linkField.settings.field_values[selectedLanguage]))
        return item[linkField.field_name]
      const indexVal = item[linkField.field_name].replaceAll("__index__", "")
      const fieldValues = linkField.settings.field_values[selectedLanguage].split("\n")
      if (isNaN(parseInt(indexVal)))
        return item[linkField.field_name]
      return fieldValues[parseInt(indexVal)]
    }
    else if (linkField.field_type === "text") {
      if (!item[linkField.field_name])
        return item.__auto_id__
      if (!item[linkField.field_name][selectedLanguage])
        return item[linkField.field_name]
      return item[linkField.field_name][selectedLanguage]
    }
    return item[linkField.field_name]
  }

  const fetchCollectionItems = async () => {

    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const collectionId = entity.reference_id
    const collectionBaseKey = entity.settings.selected_collection_definition_id ? "cd_" + entity.settings.selected_collection_definition_id : null
    let linkField = null
    try {
      const resDef = await CollectionTypesService.getCollectionConfiguration(accID, subscriptionId, subscriberId, collectionId)
      linkField = resDef.data.fields_list[0]
      if (entity.settings.link_field) {
        const findLink = resDef.data.fields_list.find(x => x.field_name === entity.settings.link_field)
        if (findLink)
          linkField = findLink
      }
    }
    catch (err) {
      console.log("Error while fetching link fields details", err)
    }

    const searchCriteriaObj = {
      search_context: {
        last_evaluated_key: null,
        page_size: 10,
        page_no: 10,
        account_id: accID,
      },
      search_criteria: {
        sort_order: [
          {
            direction: "string",
            field_name: "string"
          }
        ]
      }
    }
    if (collectionBaseKey)
      searchCriteriaObj.search_context.collection_definition_base_key = collectionBaseKey
    else
      searchCriteriaObj.search_context.collection_definition_id = collectionId
    const dataTemp = []
    try {
      let lastKey = null
      do {
        searchCriteriaObj.search_context.last_evaluated_key = lastKey
        const resApi = await CollectionItemsService.getAllItemsInCollection(accID, subscriptionId, subscriberId, collectionId, searchCriteriaObj)
        Object.keys(resApi.data).forEach(key => {
          if (validate(key)) {
            resApi.data[key].forEach(item => {
              dataTemp.push({
                __auto_id__: item.payload.__auto_id__,
                id: item.payload.id,
                name: getRelationLookupName(linkField, item.payload)
              })
            })
          }
        })
        lastKey = resApi.data.last_evaluated_key
      } while (lastKey != null);
      setRelationLookupList(dataTemp)
    }
    catch (err) {
      console.log("Error occured while fetching list of collection Items for" + entity.field_name, err)
    }
  }

  const handleMultiSelectChange = (event, value) => {
    if (value !== null) {
      let arr = fieldValues[entity.field_name] && fieldValues[entity.field_name].length > 0 ? [...fieldValues[entity.field_name]] : []
      arr.push(value)
      setFieldValues(prev => ({ ...prev, [entity.field_name]: arr }))
      validateSingleField(entity, arr)
    }
    else {
      // setFieldValues(prev => ({...prev, [entity.field_name]: []}))
    }
  }

  const deleteSelectedRelationItem = (index) => {
    let arr = fieldValues[entity.field_name]
    arr.splice(index, 1)
    setFieldValues(prev => ({ ...prev, [entity.field_name]: arr }))
    validateSingleField(entity, arr)
  }

  const clearRelationItem = () => {
    setFieldValues(prev => ({ ...prev, [entity.field_name]: [] }))
    validateSingleField(entity, [])
  }

  const defaultValueForField = (entity) => {
    switch (entity.field_type) {
      case 'list':
        if (entity.field_sub_type === 'multi')
          return entity.settings.default_value && !isNaN(entity.settings.default_value) ? ["__index__" + entity.settings.default_value] : []
        else
          return entity.settings.default_value && !isNaN(entity.settings.default_value) ? "__index__" + entity.settings.default_value : ''
      case 'text':
      case 'rich_text':
        if (entity.settings.default_value != null && typeof entity.settings.default_value === "object")
          return ({
            ...entity.settings.default_value
          })
        else {
          const tmpObj = {}
          languageList.forEach(lang => {
            tmpObj[lang.value] = ""
          })
          return tmpObj
        }
      case 'number':
      case 'password':
      case 'email':
        return entity.settings.default_value ?? ''
      case 'bool':
        return getDefaultBooleanValue(entity.settings.default_value)
      case 'date':
        switch (entity.field_sub_type) {
          case 'date':
          case 'Date':
            return moment.utc().toISOString()
          case 'time':
          case 'Time':
            return moment.utc().format("HH:mm")
          case 'dateTime':
          case 'DateTime':
            return moment.utc().toISOString()
          default:
            return moment.utc().toISOString()
        }
      case 'media':
      case 'component':
      case 'relation':
        return []
      default:
        return ''
    }
  }

  const validateSingleField = (entity, value, selectedLang) => {
    const langSelec = selectedLang ?? selectedLanguage
    if (entity.settings.is_mandatory) {
      if (value == null || value === '') {
        if (entity.field_type === "text" || entity.field_type === "rich_text")
          setFieldErrors(prev => {
            if (prev[entity.field_name] != null && prev[entity.field_name] !== "")
              return ({
                ...prev,
                [entity.field_name]: {
                  ...prev[entity.field_name],
                  [langSelec]: <FormattedMessage {...messages.fieldIsRequired} />
                }
              })
            return ({
              ...prev,
              [entity.field_name]: {
                [langSelec]: <FormattedMessage {...messages.fieldIsRequired} />
              }
            })
          })
        else
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: <FormattedMessage {...messages.fieldIsRequired} />
          }))
        return
      }
      else if (typeof value === 'object' && "length" in value && value.length === 0) {
        setFieldErrors(prev => ({
          ...prev,
          [entity.field_name]: <FormattedMessage {...messages.fieldIsRequired} />
        }))
        return
      }
      else {
        if (entity.field_type === "text" || entity.field_type === "rich_text") {
          setFieldErrors(prev => {
            let currErr = prev[entity.field_name]
            if (currErr && typeof currErr === "object") {
              delete currErr[langSelec]
              if (Object.keys(currErr).length === 0)
                currErr = null
            }
            return ({
              ...prev,
              [entity.field_name]: currErr
            })
          })
        }
        else {
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: null
          }))
        }
      }
    }
    if (entity.settings.min_length) {
      if (typeof value === "string" && value !== "" && value.length < parseInt(entity.settings.min_length)) {
        if (entity.field_type === "text" || entity.field_type === "rich_text")
          setFieldErrors(prev => {
            if (prev[entity.field_name] != null && prev[entity.field_name] !== "")
              return ({
                ...prev,
                [entity.field_name]: {
                  ...prev[entity.field_name],
                  [langSelec]: "Minimum " + entity.settings.min_length + " length required"
                }
              })
            return ({
              ...prev,
              [entity.field_name]: {
                [langSelec]: "Minimum " + entity.settings.min_length + " length required"
              }
            })
          })
        else
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: "Minimum " + entity.settings.min_length + " length required"
          }))
        return
      }
      else {
        if (entity.field_type === "text" || entity.field_type === "rich_text") {
          setFieldErrors(prev => {
            const currErr = prev[entity.field_name]
            if (currErr && typeof currErr === "object") {
              delete currErr[langSelec]
              if (Object.keys(currErr).length === 0)
                currErr = null
            }
            return ({
              ...prev,
              [entity.field_name]: currErr
            })
          })
        }
        else {
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: null
          }))
        }
      }
    }
    if (entity.settings.max_length) {
      if (typeof value === "string" && value !== "" && value.length > parseInt(entity.settings.max_length)) {
        if (entity.field_type === "text" || entity.field_type === "rich_text")
          setFieldErrors(prev => {
            if (prev[entity.field_name] != null && prev[entity.field_name] !== "")
              return ({
                ...prev,
                [entity.field_name]: {
                  ...prev[entity.field_name],
                  [langSelec]: "Maximum " + entity.settings.max_length + " length allowed"
                }
              })
            return ({
              ...prev,
              [entity.field_name]: {
                [langSelec]: "Maximum " + entity.settings.max_length + " length allowed"
              }
            })
          })
        else
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: "Maximum " + entity.settings.max_length + " length allowed"
          }))
        return
      }
      else {
        if (entity.field_type === "text" || entity.field_type === "rich_text") {
          setFieldErrors(prev => {
            const currErr = prev[entity.field_name]
            if (currErr && typeof currErr === "object") {
              delete currErr[langSelec]
              if (Object.keys(currErr).length === 0)
                currErr = null
            }
            return ({
              ...prev,
              [entity.field_name]: currErr
            })
          })
        }
        else {
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: null
          }))
        }
      }
    }
    if (entity.field_type === "number") {
      if (entity.settings.number_format === 'integer') {
        if (value.toString().indexOf('.') != -1) {
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: <FormattedMessage {...messages.onlyIntAllowed} />
          }))
          return
        }
        else
          setFieldErrors(prev => ({
            ...prev,
            [entity.field_name]: null
          }))
      }
      if (parseFloat(value) < parseFloat(entity.settings.min_value)) {
        setFieldErrors(prev => ({
          ...prev,
          [entity.field_name]: "Minimum value allowed is " + entity.settings.min_value
        }))
        return
      }
      else if (parseFloat(value) > parseFloat(entity.settings.max_value)) {
        setFieldErrors(prev => ({
          ...prev,
          [entity.field_name]: "Maximum value allowed is " + entity.settings.max_value
        }))
        return
      }
      else
        setFieldErrors(prev => ({
          ...prev,
          [entity.field_name]: null
        }))
    }
    if (entity.field_type === "email") {
      if (!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        setFieldErrors(prev => ({
          ...prev,
          [entity.field_name]: <FormattedMessage {...messages.invalidEmail} />
        }))
        return
      }
      else
        setFieldErrors(prev => ({
          ...prev,
          [entity.field_name]: null
        }))
    }
  }

  useEffect(() => {
    if (entity) {
      if (entity.field_type === 'relation')
        fetchCollectionItems()
      if (editVal != null) {
        setFieldValues(prev => ({ ...prev, [entity.field_name]: editVal }))
        if ((entity.field_type === "text" || entity.field_type === "rich_text") && typeof editVal === "object") {
          languageList.forEach(lang => {
            validateSingleField(entity, editVal[lang.value], lang.value)
          })
        }
        else
          validateSingleField(entity, editVal)
      }
      else if (!(entity.field_name in fieldValues)) {
        const defTempVal = defaultValueForField(entity)
        setFieldValues(prev => ({ ...prev, [entity.field_name]: defTempVal }))
        if ((entity.field_type === "text" || entity.field_type === "rich_text") && typeof editVal === "object") {
          languageList.forEach(lang => {
            validateSingleField(entity, defTempVal[lang.value], lang.value)
          })
        }
        else
          validateSingleField(entity, defTempVal)
      }
    }
  }, [entity])

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang)
  }

  const isMultiItemSelected = (item, name) => {
    if (fieldValues && fieldValues[name] && fieldValues[name].length && fieldValues[name].includes(item))
      return true
    return false
  }

  switch (entity.field_type) {
    case 'list':
      if (entity.field_sub_type === 'multi')
        return (
          // <TextField
          //   variant="filled"
          //   label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
          //   error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
          //   helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
          //   margin="normal"
          //   SelectProps={{
          //     multiple: true,
          //     native: true
          //   }}
          //   name={entity.field_name}
          //   defaultValue={entity.settings.default_value && !isNaN(entity.settings.default_value) ? getListValuesByLanguage(entity.settings.field_values, selectedLanguage)[entity.settings.default_value] : ''}
          //   fullWidth
          //   size="small"
          //   key={"collection_item_key_" + entity.field_definition_id}
          //   select
          //   id={entity.field_definition_id}
          //   onChange={handleTextValueChange}
          //   value={fieldValues && fieldValues[entity.field_name] ? fieldValues[entity.field_name] : []}
          // >
          //   {
          //     getListValuesByLanguage(entity.settings.field_values, selectedLanguage).map((item, index) =>
          //       <MenuItem key={"key_value_list_" + index} value={"__index__" + index}>{item}</MenuItem>
          //     )
          //   }
          // </TextField>
          <Box key={"collection_item_key_" + entity.field_definition_id}>
            <Box display="flex">
              <Typography sx={classes.fieldSetText}>
                {getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
              </Typography>
            </Box>
            <Box id={entity.field_definition_id} sx={classes.multiSelectCustomRoot}>
              <Box key={"key_value_list_PLEASE_SELECT"} display="flex" justifyContent="center" sx={classes.multiSelectCustomItem}>
                <Typography sx={classes.menuText}>
                  -- Please Select --
                </Typography>
              </Box>
              {
                getListValuesByLanguage(entity.settings.field_values, selectedLanguage).map((item, index) =>
                  <Box
                    key={"key_value_list_" + index}
                    sx={isMultiItemSelected("__index__" + index, entity.field_name) ? classes.multiSelectCustomItemSelected : classes.multiSelectCustomItem}
                    onClick={() => {
                      handleMultiSelectSelected({
                        target: {
                          name: entity.field_name,
                          value: "__index__" + index
                        }
                      })
                    }}
                  >
                    <Typography sx={classes.menuText}>
                      {item}
                    </Typography>
                  </Box>
                )
              }
            </Box>
            {
              validateTriggered && fieldErrors && fieldErrors[entity.field_name] && fieldErrors[entity.field_name][selectedLanguage] ? (
                <FormLabel sx={classes.errorLabel}>
                  {fieldErrors[entity.field_name][selectedLanguage]}
                </FormLabel>
              )
                :
                ''
            }
          </Box>
        )
      else
        return (
          <TextField
            variant="filled"
            label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
            error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
            helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
            margin="normal"
            name={entity.field_name}
            defaultValue={entity.settings.default_value && !isNaN(entity.settings.default_value) ? getListValuesByLanguage(entity.settings.field_values, selectedLanguage)[entity.settings.default_value] : ''}
            fullWidth
            size="small"
            select
            id={entity.field_definition_id}
            key={"collection_item_key_" + entity.field_definition_id}
            onChange={handleTextValueChange}
            value={fieldValues && fieldValues[entity.field_name] ? fieldValues[entity.field_name] : ''}
          >
            {
              getListValuesByLanguage(entity.settings.field_values, selectedLanguage).map((item, index) =>
                <MenuItem key={"key_value_list_" + index} value={"__index__" + index}>{item}</MenuItem>
              )
            }
          </TextField>
        )
    case 'text':
      if (entity.field_sub_type === 'long')
        return (
          <Box width="100%">
            {
              isLocalEnable
                ?
                <Box display="flex" width="100%" flexWrap="wrap">
                  {
                    languageList.map(lang =>
                      <Box
                        sx={lang.value === selectedLanguage ? classes.languageChipCoxSelected : classes.languageChipCox}
                        onClick={handleLanguageChange.bind(this, lang.value)}
                      >
                        {/* <Typography sx={classes.languageChipText}>{lang.name}</Typography> */}
                        {lang.name}
                      </Box>
                    )
                  }
                </Box>
                :
                ''
            }
            <TextField
              variant="filled"
              label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
              error={validateTriggered && fieldErrors && fieldErrors[entity.field_name] && fieldErrors[entity.field_name][selectedLanguage]}
              helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] && fieldErrors[entity.field_name][selectedLanguage] ? fieldErrors[entity.field_name][selectedLanguage] : ''}
              margin="normal"
              name={entity.field_name}
              fullWidth
              multiline
              rowsMax={6}
              rows={4}
              size="small"
              id={entity.field_definition_id}
              key={"collection_item_key_" + entity.field_definition_id}
              defaultValue={getCollectionLabel('', entity.settings.default_value, selectedLanguage)}
              onChange={handleTextValueChangeMultiLanguage}
              inputProps={{ maxLength: entity.settings.max_length ?? 999, minLength: entity.settings.min_length ?? 0 }}
              onBlur={entity.settings?.is_unique ?
                (e) => {
                  validateUniqueness(e, selectedLanguage)
                }
                : null}
              value={fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name][selectedLanguage] ? fieldValues[entity.field_name][selectedLanguage] : ''}
            />
          </Box>
        )
      return (
        <Box width="100%">
          {
            isLocalEnable
              ?
              <Box display="flex" flexWrap="wrap" width="100%">
                {
                  languageList.map(lang =>
                    <Box
                      sx={lang.value === selectedLanguage ? classes.languageChipCoxSelected : classes.languageChipCox}
                      onClick={handleLanguageChange.bind(this, lang.value)}
                    >
                      {/* <Typography sx={classes.languageChipText}>{lang.name}</Typography> */}
                      {lang.name}
                    </Box>
                  )
                }
              </Box>
              :
              ''
          }
          <TextField
            variant="filled"
            label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
            error={validateTriggered && fieldErrors && fieldErrors[entity.field_name] && fieldErrors[entity.field_name][selectedLanguage]}
            helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] && fieldErrors[entity.field_name][selectedLanguage] ? fieldErrors[entity.field_name][selectedLanguage] : ''}
            margin="normal"
            name={entity.field_name}
            fullWidth
            size="small"
            id={entity.field_definition_id}
            key={"collection_item_key_" + entity.field_definition_id}
            defaultValue={getCollectionLabel('', entity.settings.default_value, selectedLanguage)}
            onChange={handleTextValueChangeMultiLanguage}
            inputProps={{ maxLength: entity.settings.max_length ?? 999, minLength: entity.settings.min_length ?? 0 }}
            onBlur={entity.settings?.is_unique ?
              (e) => {
                validateUniqueness(e, selectedLanguage)
              }
              : null}
            value={fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name][selectedLanguage] ? fieldValues[entity.field_name][selectedLanguage] : ''}
          />
        </Box>
      )
    case 'number':
      return (
        <TextField
          variant="filled"
          label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
          error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
          helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
          margin="normal"
          name={entity.field_name}
          fullWidth
          size="small"
          id={entity.field_definition_id}
          key={"collection_item_key_" + entity.field_definition_id}
          type="Number"
          defaultValue={entity.settings.default_value}
          onChange={handleTextValueChange}
          onBlur={entity.settings?.is_unique ? validateUniqueness : null}
          inputProps={{ max: entity.settings.max_value ?? 999, min: entity.settings.min_value ?? 0, step: entity.settings.number_format === "integer" ? 1 : 0.1 }}
          value={fieldValues ? fieldValues[entity.field_name] : ''}
        />
      )
    case 'password':
      return (
        <TextField
          variant="filled"
          label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
          error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
          helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
          margin="normal"
          name={entity.field_name}
          fullWidth
          id={entity.field_definition_id}
          key={"collection_item_key_" + entity.field_definition_id}
          type="password"
          size="small"
          defaultValue={entity.settings.default_value}
          onChange={handleTextValueChange}
          onBlur={entity.settings?.is_unique ? validateUniqueness : null}
          inputProps={{ maxLength: entity.settings.max_length ?? 999, minLength: entity.settings.min_length ?? 0 }}
          value={fieldValues ? fieldValues[entity.field_name] : ''}
        />
      )
    case 'email':
      return (
        <TextField
          variant="filled"
          label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
          error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
          helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
          margin="normal"
          name={entity.field_name}
          fullWidth
          id={entity.field_definition_id}
          key={"collection_item_key_" + entity.field_definition_id}
          type="email"
          size="small"
          defaultValue={entity.settings.default_value}
          onChange={handleTextValueChange}
          onBlur={entity.settings?.is_unique ? validateUniqueness : null}
          inputProps={{ maxLength: entity.settings.max_length ?? 999, minLength: entity.settings.min_length ?? 0 }}
          value={fieldValues ? fieldValues[entity.field_name] : ''}
        />
      )
    case 'date':
      switch (entity.field_sub_type) {
        case 'date':
        case 'Date':
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                autoOk
                // format="dd MMM yyyy"
                format="dd MMM yyyy h:mm aaa"
                margin="normal"
                id={entity.field_definition_id}
                key={"collection_item_key_" + entity.field_definition_id}
                name={entity.field_name}
                fullWidth
                size="small"
                // disablePast
                label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
                error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
                helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
                // value={fieldValues && fieldValues[entity.field_name] ? moment.utc(fieldValues[entity.field_name]).local().toDate() : new Date()}
                value={fieldValues && fieldValues[entity.field_name] ? moment.utc(fieldValues[entity.field_name]).toDate() : new Date()}
                // onChange={(date) => {
                //   setFieldValues(prevValue => ({
                //     ...prevValue,
                //     [entity.field_name]: moment(date).utc().format("MM/DD/YYYY")
                //   }))
                //   validateSingleField(entity, moment(date).utc().format("MM/DD/YYYY"))
                // }}

                onChange={(date) => {
                  setFieldValues(prevValue => ({ ...prevValue, [entity.field_name]: moment(date).utc().toISOString() }))
                  validateSingleField(entity, date)
                }}
                TextFieldComponent={props => <TextField  {...props} variant="filled" size="small" error={null} />}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          )
        case 'time':
        case 'Time':
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="normal"
                id={entity.field_definition_id}
                key={"collection_item_key_" + entity.field_definition_id}
                name={entity.field_name}
                format="h:mm a"
                label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
                // value={fieldValues && fieldValues[entity.field_name] ? moment(fieldValues[entity.field_name], "h:mm a").toDate() : new Date()}
                value={fieldValues && fieldValues[entity.field_name] ? moment(fieldValues[entity.field_name], "HH:mm").toDate() : new Date()}
                error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
                helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
                fullWidth
                size="small"
                // onChange={(date) => {
                //   setFieldValues(prevValue => ({ ...prevValue, [entity.field_name]: moment(date).format("HH:mm") }))
                //   validateSingleField(entity, date)
                // }}
                onChange={(date) => {
                  setFieldValues(prevValue => ({ ...prevValue, [entity.field_name]: moment(date).utc().toISOString() }))
                  validateSingleField(entity, date)
                }}
                TextFieldComponent={props => <TextField  {...props} variant="filled" size="small" error={null} />}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }} />
            </MuiPickersUtilsProvider>
          )
        default:
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                margin="normal"
                id={entity.field_definition_id}
                key={"collection_item_key_" + entity.field_definition_id}
                name={entity.field_name}
                autoOk
                format="dd MMM yyyy h:mm a"
                label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
                value={fieldValues && fieldValues[entity.field_name] ? moment.utc(fieldValues[entity.field_name]).local().toDate() : new Date()}
                error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
                helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
                fullWidth
                size="small"
                // onChange={(date) => {
                //   setFieldValues(prevValue => ({ ...prevValue, [entity.field_name]: moment(date).utc().format("MM/DD/YYYY h:mm a") }))
                //   validateSingleField(entity, date)
                // }}
                onChange={(date) => {
                  setFieldValues(prevValue => ({ ...prevValue, [entity.field_name]: moment(date).utc().toISOString() }))
                  validateSingleField(entity, date)
                }}
                TextFieldComponent={props => <TextField  {...props} variant="filled" size="small" error={null} />}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }} />
            </MuiPickersUtilsProvider>
          )
      }
      break;
    case 'rich_text':
      return (
        <Box width="100%">
          {
            isLocalEnable
              ?
              <Box display="flex" width="100%" flexWrap="wrap">
                {
                  languageList.map(lang =>
                    <Box
                      sx={lang.value === selectedLanguage ? classes.languageChipCoxSelected : classes.languageChipCox}
                      onClick={handleLanguageChange.bind(this, lang.value)}
                    >
                      {/* <Typography sx={classes.languageChipText}>{lang.name}</Typography> */}
                      {lang.name}
                    </Box>
                  )
                }
              </Box>
              :
              ''
          }
          <ReactQuill
            theme="snow"
            placeholder={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
            name={entity.field_name}
            id={entity.field_definition_id}
            key={"collection_item_key_" + entity.field_definition_id}
            fullWidth
            onBlur={
              (range, user, content) => {
                if (entity.settings?.is_unique)
                  validateUniqueness(
                    {
                      target: {
                        name: entity.field_name,
                        value: content.getHTML(),
                      },
                    },
                    selectedLanguage
                  )
              }
            }
            style={{
              height: '150px',
              width: '100%',
              paddingBottom: '40px',
              marginTop: '10px',
              borderRadius: '5px',
              backgroundColor: '#F5F5F5'
            }}
            modules={{
              toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image'], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'size': ['small', false, 'large', 'huge'] }], [{ 'align': ['', 'right', 'center', 'justify'] }]]
            }}
            value={fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name][selectedLanguage] ? fieldValues[entity.field_name][selectedLanguage] : ''}
            onChange={(value, delta, source, editor) => {
              if (source === 'user') {
                handleTextValueChangeMultiLanguage({
                  target: {
                    name: entity.field_name,
                    value: value,
                    actualValue: editor.getText()
                  }
                });
              }
            }}
          />
          {
            validateTriggered && fieldErrors && fieldErrors[entity.field_name] && fieldErrors[entity.field_name][selectedLanguage] ? (
              <FormLabel sx={classes.errorLabel}>
                {fieldErrors[entity.field_name][selectedLanguage]}
              </FormLabel>
            )
              :
              ''
          }
        </Box>
      )
    case 'media':
      return (
        <Box my="10px">
          <Drawer anchor={'right'} open={openFileDrawer} onClose={handleCloseFileDrawer}>
            <SearchAndAddFiles
              handleClose={handleCloseFileDrawer}
              handleDone={handleFileSelected}
              selectedUser={props.selectedUser}
              selectionLimit={entity.field_sub_type === "single" ? 1 : null}
              fileTypeLimit={
                entity.settings.media_type === 'images'
                  ?
                  [FILE_TYPE_IMAGE]
                  :
                  entity.settings.media_type === 'videos'
                    ?
                    [FILE_TYPE_VIDEO]
                    :
                    entity.settings.media_type === 'files'
                      ?
                      [FILE_TYPE_DOCUMENT]
                      :
                      null
              }
            />
          </Drawer>
          <Box display="flex" width="100%" flexWrap="wrap">
            {
              fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name].length && fieldValues[entity.field_name].length > 0
                ?
                <Box display="flex" width="100%" maxWidth="960px" flexWrap="wrap">
                  {
                    fieldValues[entity.field_name].map((item, index) => {
                      if (item.file_type === FILE_TYPE_IMAGE || item.file_type === FILE_TYPE_VIDEO)
                        return (
                          <Box display="flex" marginTop="20px" marginLeft="-20px" marginRight="10px" key={"collection_item_key_media_" + index + "_" + entity.field_definition_id}>
                            <ImageComponent
                              image={item.thumbnail_url}
                              isWide={true}
                              onSelect={null}
                              onRemove={() => {
                                setFieldValues(prevValue => {
                                  const tmpArr = prevValue[entity.field_name].filter(x => x.file_id !== item.file_id)
                                  validateSingleField(entity, tmpArr)
                                  return ({
                                    ...prevValue,
                                    [entity.field_name]: tmpArr
                                  })
                                })
                              }}
                            />
                          </Box>
                        )
                      else
                        return (
                          < Box
                            sx={classes.photoSelector}
                            key={"collection_item_key_media_" + index + "_" + entity.field_definition_id}
                            marginTop="20px"
                            marginRight="10px"
                            maxWidth="250px"
                            overflow="hidden"
                            onClick={() => {
                              setFieldValues(prevValue => {
                                const tmpArr = prevValue[entity.field_name].filter(x => x.file_id !== item.file_id)
                                validateSingleField(entity, tmpArr)
                                return ({
                                  ...prevValue,
                                  [entity.field_name]: tmpArr
                                })
                              })
                            }}
                          >
                            <DeleteOutline color="secondary" sx={classes.photoIcon} />
                            <Typography sx={classes.photoWarning} noWrap>{item.file_name}</Typography>
                          </Box>
                        )
                    })
                  }
                  {
                    entity.field_sub_type !== "single"
                      ?
                      <Box sx={classes.photoSelector} marginTop="20px" onClick={handleOpenFileDrawer}>
                        <PhotoCameraBack color="secondary" sx={classes.photoIcon} />
                        <Typography sx={classes.photoWarning}>{getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}</Typography>
                      </Box>
                      :
                      ''
                  }
                </Box>
                :
                <Box sx={classes.photoSelector} onClick={handleOpenFileDrawer}>
                  <PhotoCameraBack color="secondary" sx={classes.photoIcon} />
                  <Typography sx={classes.photoWarning}>{getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}</Typography>
                </Box>
            }
          </Box>
          {
            validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? (
              <FormLabel sx={classes.errorLabel}>
                {fieldErrors[entity.field_name]}
              </FormLabel>
            )
              :
              ''
          }
        </Box >
      )
    case 'bool':
      return (
        <Box marginY="20px">
          <Typography sx={classes.radioLabelText}>{getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}</Typography>
          <RadioGroup
            aria-label={entity.field_name}
            name={entity.field_name}
            error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
            helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
            id={entity.field_definition_id}
            key={"collection_item_key_" + entity.field_definition_id}
            row
            size="small"
            value={fieldValues && fieldValues[entity.field_name] != null ? fieldValues[entity.field_name].toString() : getDefaultBooleanValue(entity.settings.default_value)}
            color="secondary"
            onChange={handleBoolValueChange}>
            <FormControlLabel classes={{ label: classes.mediumLabel }} value='true' control={<Radio size='small' />} label={<FormattedMessage {...messages.true} />} />
            <FormControlLabel classes={{ label: classes.mediumLabel }} value='false' control={<Radio size='small' />} label={<FormattedMessage {...messages.false} />} />
          </RadioGroup>
          {
            validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? (
              <FormLabel sx={classes.errorLabel}>
                {fieldErrors[entity.field_name]}
              </FormLabel>
            )
              :
              ''
          }
        </Box>
      )
    case 'relation':
      if (entity.relation_type === "MANY")
        return (
          <Box py="15px" width="100%">
            <Autocomplete
              id={entity.field_definition_id}
              key={"collection_item_key_" + entity.field_definition_id}
              options={relationLookUpList}
              name={entity.field_name}
              size='small'
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} size="small" margin="normal" label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")} variant="filled" />}
              onChange={handleMultiSelectChange}
            />
            {
              validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? (
                <FormLabel sx={classes.errorLabel}>
                  {fieldErrors[entity.field_name]}
                </FormLabel>
              )
                :
                ''
            }
            <Box my="15px" display="flex" width="100%" flexWrap="wrap">
              {
                fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name].length
                && fieldValues[entity.field_name].map((item, index) =>
                  <Box p='5px'><Chip key={"tag_key_" + index} label={item} color="secondary" onDelete={deleteSelectedRelationItem.bind(this, index)} /></Box>
                )
              }
            </Box>
          </Box>
        )
      else
        return (
          <Box display="flex" alignItems="center" py="15px" width="100%">
            <TextField
              variant="filled"
              label={getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}
              margin="normal"
              name={entity.field_name}
              fullWidth
              error={validateTriggered && fieldErrors && fieldErrors[entity.field_name]}
              helperText={validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? fieldErrors[entity.field_name] : ''}
              size="small"
              select
              id={entity.field_definition_id}
              key={"collection_item_key_" + entity.field_definition_id}
              onChange={(event) => { handleMultiSelectChange(null, event.target.value) }}
              value={fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name].length ? fieldValues[entity.field_name][0] : ''}
            >
              {
                relationLookUpList.map((item, index) =>
                  <MenuItem key={"key_value_list_" + index} value={item.__auto_id__}>{item.name}</MenuItem>
                )
              }
            </TextField>
            <CloseOutlined sx={classes.closeIcon} onClick={clearRelationItem} />
          </Box>
        )

    case 'component':
      if (entity.field_sub_type === "single")
        return (
          <Box width="100%">
            {
              entityExtraData
                ?
                <Box sx={classes.fieldSetSingleBoxContainer}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" marginY="10px">
                    <Box marginX="10px">
                      {
                        checkedList[0]
                          ?
                          <ArrowCircleUp sx={classes.addCircleIcon} onClick={toggleCollapse.bind(this, 0)} />
                          :
                          <ArrowCircleDown sx={classes.addCircleIcon} onClick={toggleCollapse.bind(this, 0)} />
                      }
                    </Box>
                    <Box width="100%">
                      <Typography sx={classes.fieldSetText}>{getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}</Typography>
                    </Box>
                  </Box>
                  <Collapse in={checkedList[0]}>
                    <FieldSetRenderLayout
                      selectedFieldSet={entityExtraData}
                      selectedFieldSetName={entity.field_name}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      selectedUser={props.selectedUser}
                      selectedFieldSetIndex={0}
                      setParentFieldValues={setFieldValues}
                      editObj={editVal && editVal.length ? editVal[0] : editVal}
                      otherItemsList={fieldValues[entity.field_name]}
                      setParentFieldErrors={setFieldErrors}
                      validateTriggered={validateTriggered}
                      setSelectedLanguage={setSelectedLanguage}
                      isLocalEnable={isLocalEnable}
                    />
                  </Collapse>
                  {
                    validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? (
                      <FormLabel sx={classes.errorLabel}>
                        {fieldErrors[entity.field_name]}
                      </FormLabel>
                    )
                      :
                      ''
                  }
                </Box>
                :
                'Loading Field Set'
            }
          </Box>
        )
      else
        return (
          <Box width="100%">
            {
              entityExtraData
                ?
                <Box sx={classes.fieldSetSingleBoxContainer}>
                  <Box sx={classes.fieldSetSingleBox}>
                    <Box display="flex" width="100%" flexWrap="wrap" overflow="auto" height="100%">
                      <Typography sx={classes.fieldSetText}>{getCollectionLabel(entity.field_name, entity.localized_texts, selectedLanguage) + (entity.settings.is_mandatory ? " *" : "")}</Typography>
                    </Box>
                    <AddBox color='secondary' sx={classes.addIcon} onClick={addFieldSetItem} />
                  </Box>
                  {
                    fieldValues && fieldValues[entity.field_name] && fieldValues[entity.field_name].length
                      ?
                      fieldValues[entity.field_name].map((subItem, index) =>
                        <Box key={"field_value_sub_key_" + index} width="100%">
                          <Box display="flex" justifyContent="space-between" alignItems="center" marginY="10px">
                            <Box marginX="10px">
                              {
                                checkedList[index]
                                  ?
                                  <ArrowCircleUp sx={classes.addCircleIcon} onClick={toggleCollapse.bind(this, index)} />
                                  :
                                  <ArrowCircleDown sx={classes.addCircleIcon} onClick={toggleCollapse.bind(this, index)} />
                              }
                            </Box>
                            <Box width="100%">
                              <Typography sx={classes.componentTitle}>{entity.field_name}&nbsp;({index + 1})</Typography>
                            </Box>
                            <DeleteOutline color='secondary' sx={classes.addIcon} onClick={removeFieldSetItem.bind(this, index)} />
                          </Box>
                          <Collapse key={"local_row_collapse_key_" + index} in={checkedList[index]}>
                            <FieldSetRenderLayout
                              selectedFieldSet={entityExtraData}
                              selectedFieldSetName={entity.field_name}
                              selectedFieldSetIndex={index}
                              languageList={languageList}
                              selectedLanguage={selectedLanguage}
                              selectedUser={props.selectedUser}
                              setParentFieldValues={setFieldValues}
                              editObj={editVal && editVal.length ? editVal[index] : editVal}
                              otherItemsList={fieldValues[entity.field_name]}
                              setParentFieldErrors={setFieldErrors}
                              validateTriggered={validateTriggered}
                              setSelectedLanguage={setSelectedLanguage}
                              isLocalEnable={isLocalEnable}
                            />
                          </Collapse>
                        </Box>
                      )
                      :
                      ''
                  }
                  {
                    validateTriggered && fieldErrors && fieldErrors[entity.field_name] ? (
                      <FormLabel sx={classes.errorLabel}>
                        {fieldErrors[entity.field_name]}
                      </FormLabel>
                    )
                      :
                      ''
                  }
                </Box>
                :
                'Loading Field Set'
            }
          </Box>
        )
  }
}

CollectionItem.propTypes = {};

export default CollectionItem;
