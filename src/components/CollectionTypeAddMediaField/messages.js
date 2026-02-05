/*
 * CollectionTypeAddMediaField Messages
 *
 * This contains all the text for the CollectionTypeAddMediaField component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionTypeAddMediaField';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD NEW MEDIA FIELD',
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
  type: {
    id: `${scope}.type`,
    defaultMessage: 'Type',
  },
  typeShort: {
    id: `${scope}.typeShort`,
    defaultMessage: 'Single Media',
  },
  typeLong: {
    id: `${scope}.typeLong`,
    defaultMessage: 'Multiple Media',
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
  allowedTypes: {
    id: `${scope}.allowedTypes`,
    defaultMessage: 'Allowed Types of Media',
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
