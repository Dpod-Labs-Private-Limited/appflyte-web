/*
 * RenameFilesFolder Messages
 *
 * This contains all the text for the RenameFilesFolder component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.RenameFilesFolder';

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
  fileName: {
    id: `${scope}.fileName`,
    defaultMessage: 'File Name *',
  },
  headingFile: {
    id: `${scope}.headingFile`,
    defaultMessage: 'RENAME FILE',
  },
  headingFolder: {
    id: `${scope}.headingFolder`,
    defaultMessage: 'RENAME FOLDER',
  },
  fileNameReqd: {
    id: `${scope}.fileNameReqd`,
    defaultMessage: 'File name is required ',
  },
  folderNameReqd: {
    id: `${scope}.folderNameReqd`,
    defaultMessage: 'Folder name is required ',
  },
  renameSuccessfull: {
    id: `${scope}.renameSuccessfull`,
    defaultMessage: 'Rename Successfull',
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
  sameNameExist: {
    id: `${scope}.sameNameExist`,
    defaultMessage: 'Files/Folder with same name already exists',
  },
});
