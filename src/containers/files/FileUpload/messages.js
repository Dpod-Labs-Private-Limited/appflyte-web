/*
 * FileUpload Messages
 *
 * This contains all the text for the FileUpload container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.FileUpload';

export default defineMessages({
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  upload: {
    id: `${scope}.upload`,
    defaultMessage: 'Upload',
  },
  uploadFiles: {
    id: `${scope}.uploadFiles`,
    defaultMessage: 'UPLOAD FILES',
  },
  uploadingFile: {
    id: `${scope}.uploadingFile`,
    defaultMessage: 'Uploading files …',
  },
  manageAccess: {
    id: `${scope}.manageAccess`,
    defaultMessage: 'Manage access',
  },
  private: {
    id: `${scope}.private`,
    defaultMessage: 'Private',
  },
  public: {
    id: `${scope}.public`,
    defaultMessage: 'Public',
  },
  reqSubscription: {
    id: `${scope}.reqSubscription`,
    defaultMessage: 'Require Subscription',
  },
  filesUploaded: {
    id: `${scope}.filesUploaded`,
    defaultMessage: ' files uploaded',
  },
  errorSaving: {
    id: `${scope}.errorSaving`,
    defaultMessage: 'Something went wrong while saving',
  },
  someErrOccrd: {
    id: `${scope}.someErrOccrd`,
    defaultMessage: 'Something went wrong while saving',
  },
  invalidInput: {
    id: `${scope}.invalidInput`,
    defaultMessage: 'Please check all fields and retry',
  },
  serverError: {
    id: `${scope}.serverError`,
    defaultMessage: 'Something went wrong while saving',
  },
  savingChanges: {
    id: `${scope}.savingChanges`,
    defaultMessage: 'Saving changes',
  },
  selectAtleast1File: {
    id: `${scope}.selectAtleast1File`,
    defaultMessage: 'Select atleast 1 file',
  },
  someFilesSameName: {
    id: `${scope}.someFilesSameName`,
    defaultMessage: 'Some Files have same name',
  }
  
});
