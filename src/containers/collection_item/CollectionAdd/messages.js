/*
 * CollectionAdd Messages
 *
 * This contains all the text for the CollectionAdd container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionAdd';

export default defineMessages({
  publish: {
    id: `${scope}.publish`,
    defaultMessage: 'Publish',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
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
  collectionItemSaved: {
    id: `${scope}.collectionItemSaved`,
    defaultMessage: 'Item successfully saved',
  },
  collectionItemModified: {
    id: `${scope}.collectionItemModified`,
    defaultMessage: 'Item successfully modified',
  },
  collectionItemPublished: {
    id: `${scope}.collectionItemPublished`,
    defaultMessage: 'Item successfully published',
  },
  fieldShoulfBeUnique: {
    id: `${scope}.fieldShoulfBeUnique`,
    defaultMessage: 'Field should be unique',
  },
  fieldIsReq: {
    id: `${scope}.fieldIsReq`,
    defaultMessage: 'Field is required',
  },
  currentVersion: {
    id: `${scope}.currentVersion`,
    defaultMessage: 'Current Version :',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status :',
  },
});
