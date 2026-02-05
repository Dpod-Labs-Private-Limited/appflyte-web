/*
 * ShareFilesAndFolder Messages
 *
 * This contains all the text for the ShareFilesAndFolder component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ShareFilesAndFolder';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'SHARE',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'Done',
  },
  copyLink: {
    id: `${scope}.copyLink`,
    defaultMessage: 'Copy link',
  },
  allClients: {
    id: `${scope}.allClients`,
    defaultMessage: 'All Clients',
  },
  allStaffs: {
    id: `${scope}.allStaffs`,
    defaultMessage: 'Entire Team',
  },
  selectedPeople: {
    id: `${scope}.selectedPeople`,
    defaultMessage: 'Select People',
  },
  bothShared: {
    id: `${scope}.bothShared`,
    defaultMessage: 'Selected files/folders shared',
  },
  partialSharedFiles: {
    id: `${scope}.partialSharedFiles`,
    defaultMessage: 'Some files/folders were not shared',
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
  copied: {
    id: `${scope}.copied`,
    defaultMessage: 'Copied',
  },
});
