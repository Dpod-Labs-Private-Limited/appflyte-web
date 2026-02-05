/*
 * CollectionTypeAddRelationField Messages
 *
 * This contains all the text for the CollectionTypeAddRelationField component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionTypeAddRelationField';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD RELATION',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'Save',
  },
  basic: {
    id: `${scope}.basic`,
    defaultMessage: 'BASIC',
  },
  advanced: {
    id: `${scope}.advanced`,
    defaultMessage: 'ADVANCED',
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Name',
  },
  nameReq: {
    id: `${scope}.nameReq`,
    defaultMessage: 'Name is required',
  },
  colReq: {
    id: `${scope}.colReq`,
    defaultMessage: 'Collection is required',
  },
  locales: {
    id: `${scope}.locales`,
    defaultMessage: 'Locales',
  },
  defValue: {
    id: `${scope}.defValue`,
    defaultMessage: 'Default Value',
  },
  minLength: {
    id: `${scope}.minLength`,
    defaultMessage: 'Minimum Length',
  },
  maxLength: {
    id: `${scope}.maxLength`,
    defaultMessage: 'Maximum Length',
  },
  reqFieldType: {
    id: `${scope}.reqFieldType`,
    defaultMessage: 'Required Field',
  },
  privateField: {
    id: `${scope}.privateField`,
    defaultMessage: 'Private Field',
  },
  uniqueField: {
    id: `${scope}.uniqueField`,
    defaultMessage: 'Unique Field',
  },
  language: {
    id: `${scope}.language`,
    defaultMessage: 'Language',
  },
  selectCollection: {
    id: `${scope}.selectCollection`,
    defaultMessage: 'Select a Collection',
  },
  linkField: {
    id: `${scope}.linkField`,
    defaultMessage: 'Link Field:',
  },
  relationType: {
    id: `${scope}.relationType`,
    defaultMessage: 'Relation Type',
  },
  nameAlreadyUsed: {
    id: `${scope}.nameAlreadyUsed`,
    defaultMessage: 'Field name should be unique',
  },
  linkFieldNotDefinedForThis: {
    id: `${scope}.linkFieldNotDefinedForThis`,
    defaultMessage: 'Link Field not defined for this Collection',
  },
  noCollectionFound: {
    id: `${scope}.noCollectionFound`,
    defaultMessage: 'No Collection Found',
  },
  systemReservedKeywordErr: {
    id: `${scope}.systemReservedKeywordErr`,
    defaultMessage: 'System reserved keywords cannot be used as field name.',
  },
});
