/*
 * FilesRecycleBin Messages
 *
 * This contains all the text for the FilesRecycleBin container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.FilesRecycleBin';

export default defineMessages({
  back: {
    id: `${scope}.back`,
    defaultMessage: 'Back',
  },
  back: {
    id: `${scope}.back`,
    defaultMessage: 'Back',
  },
  restore: {
    id: `${scope}.restore`,
    defaultMessage: 'Restore',
  },
  deleteForever: {
    id: `${scope}.deleteForever`,
    defaultMessage: 'Delete Forever',
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
    defaultMessage: 'Something went wrong while fetching files',
  },
  noItems: {
    id: `${scope}.noItems`,
    defaultMessage: 'No Items',
  },
  bothRestored: {
    id: `${scope}.bothRestored`,
    defaultMessage: 'Successfully restored',
  },
  partialRestoreFiles: {
    id: `${scope}.partialRestoreFiles`,
    defaultMessage: 'Some Files/Folders were not restored',
  },
  partialDeletedFiles: {
    id: `${scope}.partialDeletedFiles`,
    defaultMessage: 'Some Files/Folders were not deleted',
  },
  bothDeleted: {
    id: `${scope}.bothDeleted`,
    defaultMessage: 'Successfully deleted',
  },
});
