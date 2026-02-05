/*
 * CollectionTypeAddListField Messages
 *
 * This contains all the text for the CollectionTypeAddListField component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionTypeAddListField';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD NEW LIST FIELD',
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
  fieldValues: {
    id: `${scope}.fieldValues`,
    defaultMessage: 'Values (one line per value)',
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
  fieldValuesReq: {
    id: `${scope}.fieldValuesReq`,
    defaultMessage: 'Atleast 1 value Required',
  },
  dispName: {
    id: `${scope}.dispName`,
    defaultMessage: 'Display Name',
  },
  nameAlreadyUsed: {
    id: `${scope}.nameAlreadyUsed`,
    defaultMessage: 'Field name should be unique',
  },
  allowMultiple: {
    id: `${scope}.allowMultiple`,
    defaultMessage: 'Allow Multiple Selection',
  },
  addItemsFirst: {
    id: `${scope}.addItemsFirst`,
    defaultMessage: 'No item added',
  },
  systemReservedKeywordErr: {
    id: `${scope}.systemReservedKeywordErr`,
    defaultMessage: 'System reserved keywords cannot be used as field name.',
  },
  valuesMismatch: {
    id: `${scope}.valuesMismatch`,
    defaultMessage: 'No. of values should be same in all language',
  },
  addItem: {
    id: `${scope}.addItem`,
    defaultMessage: 'Add Item',
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add',
  },
});
