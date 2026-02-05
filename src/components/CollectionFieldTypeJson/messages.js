/*
 * CollectionFieldTypeJson Messages
 *
 * This contains all the text for the CollectionFieldTypeJson component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionFieldTypeJson';

export default defineMessages({
  searchAndAddHeading: {
    id: `${scope}.searchAndAddHeading`,
    defaultMessage: 'ADD NEW JSON FIELD',
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
    defaultMessage: 'Manual',
  },
  typeLong: {
    id: `${scope}.typeLong`,
    defaultMessage: 'Auto (Fetch from an API) ',
  },
  locales: {
    id: `${scope}.locales`,
    defaultMessage: 'Locales',
  },
  language: {
    id: `${scope}.language`,
    defaultMessage: 'Language',
  },
  apiUrl: {
    id: `${scope}.apiUrl`,
    defaultMessage: 'API URL',
  },
  freqRefresh: {
    id: `${scope}.freqRefresh`,
    defaultMessage: 'Frequency of Refresh',
  },
  minute: {
    id: `${scope}.minute`,
    defaultMessage: 'Min',
  },
  minute: {
    id: `${scope}.minute`,
    defaultMessage: 'Min',
  },
  userName: {
    id: `${scope}.userName`,
    defaultMessage: 'Username',
  },
  apiAuthentication: {
    id: `${scope}.apiAuthentication`,
    defaultMessage: 'Authentication',
  },
  apiMethod: {
    id: `${scope}.apiMethod`,
    defaultMessage: 'Method',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Header',
  },
  key: {
    id: `${scope}.key`,
    defaultMessage: 'Key',
  },
  value: {
    id: `${scope}.value`,
    defaultMessage: 'Value',
  },
  jsonSchema: {
    id: `${scope}.jsonSchema`,
    defaultMessage: 'JSON Schema',
  },
  manualSchema: {
    id: `${scope}.manualSchema`,
    defaultMessage: 'Manual',
  },
  autoSchema: {
    id: `${scope}.autoSchema`,
    defaultMessage: 'Auto (Derive from Sample Data)',
  },
  jsonSchema: {
    id: `${scope}.jsonSchema`,
    defaultMessage: 'JSON Schema',
  },
  sampleJsonResponse: {
    id: `${scope}.sampleJsonResponse`,
    defaultMessage: 'Sample API Response to Generate Schema',
  },
  generateBtn: {
    id: `${scope}.generateBtn`,
    defaultMessage: 'Generate',
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
  apiUrlReq: {
    id: `${scope}.apiUrlReq`,
    defaultMessage: 'API url is required',
  },
  apiMethodReq: {
    id: `${scope}.apiMethodReq`,
    defaultMessage: 'API method is required',
  },
  apiAuthenticationReq: {
    id: `${scope}.apiAuthenticationReq`,
    defaultMessage: 'Required',
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
