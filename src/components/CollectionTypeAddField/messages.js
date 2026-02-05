/*
 * CollectionTypeAddField Messages
 *
 * This contains all the text for the CollectionTypeAddField component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionTypeAddField';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD NEW TEXT FIELD',
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
  language: {
    id: `${scope}.language`,
    defaultMessage: 'Language',
  },
});
