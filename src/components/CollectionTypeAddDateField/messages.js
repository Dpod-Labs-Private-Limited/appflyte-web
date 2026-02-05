/*
 * CollectionTypeAddDateField Messages
 *
 * This contains all the text for the CollectionTypeAddDateField component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionTypeAddDateField';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD NEW DATE FIELD',
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
  numberFormat: {
    id: `${scope}.numberFormat`,
    defaultMessage: 'Number Format',
  },
  dateFormat: {
    id: `${scope}.dateFormat`,
    defaultMessage: 'Date Format',
  },
  subType: {
    id: `${scope}.subType`,
    defaultMessage: 'Type',
  },
  nameReq: {
    id: `${scope}.nameReq`,
    defaultMessage: 'Name is required',
  },
  locales: {
    id: `${scope}.locales`,
    defaultMessage: 'Locales',
  },
  defValue: {
    id: `${scope}.defValue`,
    defaultMessage: 'Default Value',
  },
  reqFieldType: {
    id: `${scope}.reqFieldType`,
    defaultMessage: 'Required Field',
  },
  privateField: {
    id: `${scope}.privateField`,
    defaultMessage: 'Private Field',
  },
  language: {
    id: `${scope}.language`,
    defaultMessage: 'Language',
  },
  localReq: {
    id: `${scope}.localReq`,
    defaultMessage: 'Atleast 1 Language Required',
  },
  req: {
    id: `${scope}.req`,
    defaultMessage: 'Required',
  },
  languageALreadySelected: {
    id: `${scope}.languageALreadySelected`,
    defaultMessage: 'Should be unique',
  },
  nameAlreadyUsed: {
    id: `${scope}.nameAlreadyUsed`,
    defaultMessage: 'Field name should be unique',
  },
  systemReservedKeywordErr: {
    id: `${scope}.systemReservedKeywordErr`,
    defaultMessage: 'System reserved keywords cannot be used as field name.',
  },
});
