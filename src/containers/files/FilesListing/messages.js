/*
 * FilesListing Messages
 *
 * This contains all the text for the FilesListing container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.FilesListing';

export default defineMessages({
  uploadFile: {
    id: `${scope}.uploadFile`,
    defaultMessage: 'Upload File',
  },
  newFolder: {
    id: `${scope}.newFolder`,
    defaultMessage: 'New Folder',
  },
  filterTag: {
    id: `${scope}.filterTag`,
    defaultMessage: 'All Files',
  },
  clearFilter: {
    id: `${scope}.clearFilter`,
    defaultMessage: 'Clear Filters',
  },
  actions: {
    id: `${scope}.actions`,
    defaultMessage: 'Actions',
  },
  moveTo: {
    id: `${scope}.moveTo`,
    defaultMessage: 'Move to …',
  },
  rename: {
    id: `${scope}.rename`,
    defaultMessage: 'Rename',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  folders: {
    id: `${scope}.folders`,
    defaultMessage: 'Folders',
  },
  documents: {
    id: `${scope}.documents`,
    defaultMessage: 'Documents',
  },
  videos: {
    id: `${scope}.videos`,
    defaultMessage: 'Videos',
  },
  photos: {
    id: `${scope}.photos`,
    defaultMessage: 'Photos',
  },
  share: {
    id: `${scope}.share`,
    defaultMessage: 'Share',
  },
  manageAccess: {
    id: `${scope}.manageAccess`,
    defaultMessage: 'Manage access',
  },
  tag: {
    id: `${scope}.tag`,
    defaultMessage: 'Tag',
  },
  errorSaving: {
    id: `${scope}.errorSaving`,
    defaultMessage: 'Something went wrong while fetching files',
  },
  someErrOccrd: {
    id: `${scope}.someErrOccrd`,
    defaultMessage: 'Something went wrong while fetching files',
  },
  invalidInput: {
    id: `${scope}.invalidInput`,
    defaultMessage: 'Please check all fields and retry',
  },
  serverError: {
    id: `${scope}.serverError`,
    defaultMessage: 'Something went wrong',
  },
  back: {
    id: `${scope}.back`,
    defaultMessage: 'Back',
  },
  noItems: {
    id: `${scope}.noItems`,
    defaultMessage: 'No Items',
  },
  recyclebin: {
    id: `${scope}.recyclebin`,
    defaultMessage: 'RECYCLE BIN',
  },
  bothMoved: {
    id: `${scope}.bothMoved`,
    defaultMessage: 'Files and Folders Deleted.',
  },
  partialMovedFiles: {
    id: `${scope}.partialMovedFiles`,
    defaultMessage: 'Some files were not deleted',
  },
  partialMovedFolder: {
    id: `${scope}.partialMovedFolder`,
    defaultMessage: 'Some folders were not deleted',
  },
  shredWithMe: {
    id: `${scope}.shredWithMe`,
    defaultMessage: 'Shared with me',
  },
  download: {
    id: `${scope}.download`,
    defaultMessage: 'Download',
  },
});
