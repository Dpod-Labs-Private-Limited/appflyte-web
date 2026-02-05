/*
 * MoveToFolder Messages
 *
 * This contains all the text for the MoveToFolder component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.MoveToFolder';

export default defineMessages({
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'MOVE HERE',
  },
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'MOVE TO FOLDER',
  },
  bothMoved: {
    id: `${scope}.bothMoved`,
    defaultMessage: 'Files and Folders moved.',
  },
  partialMovedFiles: {
    id: `${scope}.partialMovedFiles`,
    defaultMessage: 'Some files were not moved',
  },
  partialMovedFolder: {
    id: `${scope}.partialMovedFolder`,
    defaultMessage: 'Some folders were not moved',
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
  back: {
    id: `${scope}.back`,
    defaultMessage: 'Back',
  },
});
