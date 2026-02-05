/*
 * AddNewFolder Messages
 *
 * This contains all the text for the AddNewFolder component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AddNewFolder';

export default defineMessages({
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'OK ',
  },
  folderName: {
    id: `${scope}.folderName`,
    defaultMessage: 'Folder Name *',
  },
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD FOLDER',
  },
  folderNameReqd: {
    id: `${scope}.folderNameReqd`,
    defaultMessage: 'Folder name is required ',
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
  folderCreated: {
    id: `${scope}.folderCreated`,
    defaultMessage: 'Folder created',
  },
  sameNameExist: {
    id: `${scope}.sameNameExist`,
    defaultMessage: 'Files/Folder with same name already exists',
  },
});
