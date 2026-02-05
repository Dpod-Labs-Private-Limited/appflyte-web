/**
 *
 * FieldSetRenderLayout
 *
 */

import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Box } from '@mui/material';
import CollectionItem from '../../components/CollectionItem';
import CollectionTypesService from '../../Api/Services/collection/collectionTypesService';

function FieldSetRenderLayout(props) {

  const { selectedFieldSetName, otherItemsList, selectedFieldSet, languageList, selectedLanguage, selectedFieldSetIndex,
    setParentFieldValues, editObj, setParentFieldErrors, validateTriggered, setSelectedLanguage, isLocalEnable } = props

  const [fieldMap, setFieldMap] = useState()
  const [fieldValues, setFieldValues] = useState({})
  const [fieldSetMap, setFieldSetMap] = useState({})
  const [fieldSetFetchingDone, setFieldSetFetching] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})


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
      console.log("setting this obj", tempObj)
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
    if (selectedFieldSet) {
      const tempObj = {}
      const fieldSetIds = []
      selectedFieldSet.fields_list.forEach(field => {
        if (field.field_type === "component")
          fieldSetIds.push({ fieldPattern: field.field_path_pattern, fieldSetId: field.settings.selected_fieldset || field.reference_id })
        tempObj[field.field_path_pattern] = field
      })
      setFieldMap({ ...tempObj })
      fetchFieldSetDisplayConf(fieldSetIds)
    }
  }, [])

  const fieldSetterMiddleWare = (childSetterFnc) => {
    setFieldValues(childSetterFnc)
    const updatedValue = childSetterFnc(fieldValues)
    setParentFieldValues(prevParentValue => {
      let existingVal = prevParentValue[selectedFieldSetName]
      if (existingVal && existingVal.length) {
        if (existingVal[selectedFieldSetIndex] && typeof existingVal[selectedFieldSetIndex] == "object")
          existingVal[selectedFieldSetIndex] = { ...existingVal[selectedFieldSetIndex], ...updatedValue }
        else
          existingVal[selectedFieldSetIndex] = updatedValue
      }
      else
        existingVal = [updatedValue]
      return ({
        ...prevParentValue,
        [selectedFieldSetName]: existingVal
      })
    })
  }

  const errorSetterMiddleWare = (childSetterFnc) => {
    setFieldErrors(childSetterFnc)
    const updatedValue = childSetterFnc(fieldErrors)
    const searchIndex = Object.values(updatedValue).findIndex(x => x != null && x !== "")
    if (searchIndex > -1)
      setParentFieldErrors(prev => ({
        ...prev,
        [selectedFieldSetName]: true
      }))
    else
      setParentFieldErrors(prev => ({
        ...prev,
        [selectedFieldSetName]: null
      }))
  }

  const validateUniqueness = (event, selectLang) => {
    if (!event.target.value)
      return
    const searchArr = otherItemsList.filter((x, i) => i !== selectedFieldSetIndex)
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
      setParentFieldErrors(prev => ({
        ...prev,
        [selectedFieldSetName]: true
      }))
    }
    else {
      if (Object.keys(fieldErrors).find(key => key !== event.target.name && fieldErrors[key] != null && fieldErrors[key] !== ""))
        setParentFieldErrors(prev => ({
          ...prev,
          [selectedFieldSetName]: true
        }))
      else {
        if (selectLang) {
          setParentFieldErrors(prev => {
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
          setParentFieldErrors(prev => ({
            ...prev,
            [event.target.name]: null
          }))
        }
      }
      setFieldErrors(prev => ({
        ...prev,
        [event.target.name]: null
      }))
    }
  }

  console.log(fieldSetMap)

  return (
    <Box width="100%">
      {
        fieldMap && fieldSetFetchingDone && selectedFieldSet?.display_view_config?.edit?.default_view?.rows
        &&
        selectedFieldSet.display_view_config.edit.default_view.rows.map((row, rowIndex) =>
          <Box display="flex" width="100%" key={"outer_view_row_key_" + rowIndex}>
            {
              row.sections && row.sections.length && row.sections.map((col, colIndex) =>
                <Box display="flex" width="100%" marginX="10px" key={"inner_view_col_key_" + rowIndex + "_" + colIndex}>
                  {
                    fieldMap && fieldMap[col.field_path_pattern]
                    &&
                    <CollectionItem
                      entity={fieldMap[col.field_path_pattern]}
                      validateUniqueness={validateUniqueness}
                      validateTriggered={validateTriggered}
                      fieldErrors={fieldErrors}
                      setFieldErrors={errorSetterMiddleWare}
                      selectedLanguage={selectedLanguage}
                      fieldValues={fieldValues}
                      setFieldValues={fieldSetterMiddleWare}
                      entityExtraData={fieldSetMap[col.field_path_pattern] ?? null}
                      languageList={languageList}
                      setSelectedLanguage={setSelectedLanguage}
                      selectedUser={props.selectedUser}
                      editVal={editObj && fieldMap[col.field_path_pattern] && editObj[fieldMap[col.field_path_pattern].field_name]}
                      // isLocalEnable={selectedFieldSet ? selectedFieldSet.enable_localization : false}  this will be used if parent and child need seperate Lang controll
                      isLocalEnable={isLocalEnable}
                    />
                  }
                </Box>
              )
            }
          </Box>
        )
      }
    </Box>
  );
}

FieldSetRenderLayout.propTypes = {};

export default FieldSetRenderLayout;
