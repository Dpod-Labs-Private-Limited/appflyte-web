/*
 * SearchAndAddFiles Messages
 *
 * This contains all the text for the SearchAndAddFiles component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SearchAndAddFiles';

export default defineMessages({
  searchAndAddHeading: {
    id: `${scope}.searchAndAddHeading`,
    defaultMessage: 'SEARCH AND ADD FILES',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'Add',
  },
  searchResult: {
    id: `${scope}.searchResult`,
    defaultMessage: 'Search Results',
  },
  noItems: {
    id: `${scope}.noItems`,
    defaultMessage: 'No items',
  },
  allFIles: {
    id: `${scope}.allFIles`,
    defaultMessage: 'All Files',
  },
  clearFilter: {
    id: `${scope}.clearFilter`,
    defaultMessage: 'Clear Filters',
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
  back: {
    id: `${scope}.back`,
    defaultMessage: 'Back',
  },
});
