/*
 * AddTagFilesAndFolder Messages
 *
 * This contains all the text for the AddTagFilesAndFolder component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AddTagFilesAndFolder';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'TAG',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'Done',
  },
  someErrOccrd: {
    id: `${scope}.someErrOccrd`,
    defaultMessage: 'Something went wrong.',
  },
  invalidInput: {
    id: `${scope}.invalidInput`,
    defaultMessage: 'Please check all fields and retry',
  },
  serverError: {
    id: `${scope}.serverError`,
    defaultMessage: 'Something went wrong.',
  },
});
