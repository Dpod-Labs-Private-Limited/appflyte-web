/**
 *
 * CollectionFieldTypeModal
 *
 */

import React, { useEffect, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Divider, LinearProgress, Drawer } from '@mui/material';
import styles from './styles';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import CollectionFieldTypeSelector from '../CollectionFieldTypeSelector';
// import CollectionTypeAddField from '../CollectionTypeAddField/Loadable';
import CollectionTypeAddTextField from '../CollectionTypeAddTextField';
import CollectionTypeAddRichText from '../CollectionTypeAddRichText';
import CollectionTypeAddNumberField from '../CollectionTypeAddNumberField';
import CollectionTypeAddPasswordField from '../CollectionTypeAddPasswordField';
import CollectionTypeAddEmailField from '../CollectionTypeAddEmailField';
import CollectionTypeAddListField from '../CollectionTypeAddListField';
import CollectionTypeAddDateField from '../CollectionTypeAddDateField';
import CollectionTypeAddMediaField from '../CollectionTypeAddMediaField';
import CollectionTypeAddBooleanField from '../CollectionTypeAddBooleanField';
import CollectionTypeAddRelationField from '../CollectionTypeAddRelationField';
import CollectionTypeAddFieldSetField from '../CollectionTypeAddFieldSetField';
import CollectionFieldTypeJson from '../CollectionFieldTypeJson';

const CollectionFieldTypeModal = forwardRef((props, ref) => {

  const { editdata, handleClose, languageList, isLocalEnable,
    setFields, isRestrictEdit, fieldTypeList, selectedLanguage,
    collectionTypeList, fieldSetList, fieldNames, setFieldNames, collectionTypeName, fieldSetListPublished } = props

  const classes = styles;

  const [loading, SetLoading] = useState(false)
  const [openJSONDrawer, setOpenJSONDrawer] = useState((editdata && editdata.fieldData.field_type === 'json') ? true : false)
  const [stage, setStage] = useState(editdata == null || editdata.fieldData.field_type === 'json' ? 'fieldTypeSelector' : 'selectedFieldType')

  const [selectedType, setSelectedType] = useState(editdata ? fieldTypeList.find(x => x.id === editdata.fieldData.field_type) : null)

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    if (type.id === 'json')
      handleOpenJSONDrawer()
    else
      setStage('selectedFieldType')
  }

  const handleJSONDrawerClose = () => {
    setOpenJSONDrawer(false)
    handleClose()
  }

  const handleOpenJSONDrawer = () => {
    setOpenJSONDrawer(true)
  }

  const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        ...classes.modal
      }}
    >
      <Drawer anchor={'right'} open={openJSONDrawer} onClose={handleJSONDrawerClose}>
        <CollectionFieldTypeJson
          handleClose={handleJSONDrawerClose}
          languageList={languageList}
          selectedLanguage={selectedLanguage}
          setFields={setFields}
          editdata={editdata}
          isRestrictEdit={isRestrictEdit}
          fieldType={selectedType ? selectedType.id : null}
          fieldTypeName={selectedType ? selectedType.type : null}
          isLocalEnable={isLocalEnable}
          fieldNames={fieldNames}
          setFieldNames={setFieldNames}
        />
      </Drawer>
      {
        (
          {
            'fieldTypeSelector':
              <CollectionFieldTypeSelector
                fieldTypeList={fieldTypeList}
                handleClose={handleClose}
                selectedTypeId={selectedType ? selectedType.id : null}
                handleTypeSelect={handleTypeSelect}
              />,
            'selectedFieldType': (
              selectedType
                ?
                {
                  'text':
                    <CollectionTypeAddTextField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'rich_text':
                    <CollectionTypeAddRichText
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'number':
                    <CollectionTypeAddNumberField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'password':
                    <CollectionTypeAddPasswordField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'email':
                    <CollectionTypeAddEmailField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'list':
                    <CollectionTypeAddListField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                      tostAlert={props.tostAlert}
                    />,
                  'date':
                    <CollectionTypeAddDateField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'media':
                    <CollectionTypeAddMediaField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'bool':
                    <CollectionTypeAddBooleanField
                      handleClose={handleClose}
                      languageList={languageList}
                      selectedLanguage={selectedLanguage}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      isLocalEnable={isLocalEnable}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                  'relation':
                    <CollectionTypeAddRelationField
                      handleClose={handleClose}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      collectionTypeList={collectionTypeList}
                      selectedUser={props.selectedUser}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                      collectionTypeName={collectionTypeName}
                    />,
                  'component':
                    <CollectionTypeAddFieldSetField
                      handleClose={handleClose}
                      setFields={setFields}
                      editdata={editdata}
                      isRestrictEdit={isRestrictEdit}
                      fieldType={selectedType.id}
                      fieldTypeName={selectedType.type}
                      fieldSetList={fieldSetList}
                      fieldSetListPublished={fieldSetListPublished}
                      fieldNames={fieldNames}
                      setFieldNames={setFieldNames}
                    />,
                }[selectedType.id]
                :
                ''
            )
          }[stage]
        )
      }
    </Box>
  );
});

CollectionFieldTypeModal.propTypes = {
  isLocalEnable: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  languageList: PropTypes.object.isRequired,
};

export default CollectionFieldTypeModal;
