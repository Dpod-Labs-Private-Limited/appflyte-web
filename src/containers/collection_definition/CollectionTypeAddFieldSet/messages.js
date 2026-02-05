/*
 * CollectionTypeAddFieldSet Messages
 *
 * This contains all the text for the CollectionTypeAddFieldSet container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionTypeAddFieldSet';

export default defineMessages({
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  saveDraft: {
    id: `${scope}.saveDraft`,
    defaultMessage: 'Save Draft',
  },
  publish: {
    id: `${scope}.publish`,
    defaultMessage: 'Publish',
  },
  colectionTypes: {
    id: `${scope}.colectionTypes`,
    defaultMessage: 'FIELD SET',
  },
  collectionName: {
    id: `${scope}.collectionName`,
    defaultMessage: 'Field Set Name',
  },
  fields: {
    id: `${scope}.fields`,
    defaultMessage: 'FIELDS',
  },
  addField: {
    id: `${scope}.addField`,
    defaultMessage: 'ADD FIELDS',
  },
  editField: {
    id: `${scope}.editField`,
    defaultMessage: 'EDIT FIELDS',
  },
  isLocalReq: {
    id: `${scope}.isLocalReq`,
    defaultMessage: 'Enable localization for this Field Set',
  },
  confView: {
    id: `${scope}.confView`,
    defaultMessage: 'CONFIGURE VIEW',
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
  nameReq: {
    id: `${scope}.nameReq`,
    defaultMessage: 'Field Set name is required',
  },
  successfullySaved: {
    id: `${scope}.successfullySaved`,
    defaultMessage: 'Field Set created successfully',
  },
  successfullypublished: {
    id: `${scope}.successfullypublished`,
    defaultMessage: 'Field Set published successfully',
  },
  publishStatus: {
    id: `${scope}.publishStatus`,
    defaultMessage: 'Publish Status :',
  },
  publishVersion: {
    id: `${scope}.publishVersion`,
    defaultMessage: 'Current Version :',
  },
  deleteCollectionType: {
    id: `${scope}.deleteCollectionType`,
    defaultMessage: 'Delete Field Set',
  },
  succDelete: {
    id: `${scope}.succDelete`,
    defaultMessage: 'Field Set was deleted.',
  },
  warningDelete: {
    id: `${scope}.warningDelete`,
    defaultMessage: 'Field Set contains items. Remove items to continue.',
  },
  errDelete: {
    id: `${scope}.errDelete`,
    defaultMessage: 'Field Set was not deleted due to unknown reason.',
  },
  successfullyDeletedAll: {
    id: `${scope}.successfullyDeletedAll`,
    defaultMessage: 'Field Set was succesffully deleted',
  },
  errorfullyDeletedAll: {
    id: `${scope}.errorfullyDeletedAll`,
    defaultMessage: 'Something went wrong while deleting Field Set',
  },
});
