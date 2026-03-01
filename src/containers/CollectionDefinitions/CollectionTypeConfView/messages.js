/*
 * CollectionTypeConfView Messages
 *
 * This contains all the text for the CollectionTypeConfView container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionTypeConfView';

export default defineMessages({
  entryTitle: {
    id: `${scope}.entryTitle`,
    defaultMessage: 'ENTRY TITLE',
  },
  selectField: {
    id: `${scope}.selectField`,
    defaultMessage: 'Select a Field',
  },
  listView: {
    id: `${scope}.listView`,
    defaultMessage: 'LIST VIEW',
  },
  editView: {
    id: `${scope}.editView`,
    defaultMessage: 'EDIT VIEW',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  publish: {
    id: `${scope}.publish`,
    defaultMessage: 'Save',
  },
  successfullySaved: {
    id: `${scope}.successfullySaved`,
    defaultMessage: 'Configuration Saved',
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
  listViewEmpty: {
    id: `${scope}.listViewEmpty`,
    defaultMessage: 'List view cannot be empty, Add items to continue .',
  },
  listViewEmptyWarning: {
    id: `${scope}.listViewEmptyWarning`,
    defaultMessage: 'List view is empty, are you sure you want to continue ?',
  },
  linkFieldNotSet: {
    id: `${scope}.linkFieldNotSet`,
    defaultMessage: 'Link field not selected',
  },
  linkFieldWarning: {
    id: `${scope}.linkFieldWarning`,
    defaultMessage: 'Link field not selected, are you sure you want to continue ?',
  },
  addListViewToContinue: {
    id: `${scope}.addListViewToContinue`,
    defaultMessage: 'Add Items in list view',
  },
  linkField: {
    id: `${scope}.linkField`,
    defaultMessage: 'Link Field',
  },
  emptyRowCol: {
    id: `${scope}.emptyRowCol`,
    defaultMessage: 'Remove empty Row/Column from edit view to contniue.',
  },
});
