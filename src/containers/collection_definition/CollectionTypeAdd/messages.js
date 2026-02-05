/*
 * CollectionTypeAdd Messages
 *
 * This contains all the text for the CollectionTypeAdd container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionTypeAdd';

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
    defaultMessage: 'COLLECTION TYPE',
  },
  collectionName: {
    id: `${scope}.collectionName`,
    defaultMessage: 'Collection Type Name',
  },
  collectionSingularId: {
    id: `${scope}.collectionSingularId`,
    defaultMessage: 'API ID (Singular)',
  },
  collectionPluralId: {
    id: `${scope}.collectionPluralId`,
    defaultMessage: 'API ID (Plural)',
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
    defaultMessage: 'Enable localization',
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
    defaultMessage: 'Collection name is required',
  },
  collectionSingularIdReq: {
    id: `${scope}.collectionSingularIdReq`,
    defaultMessage: 'Singular Id is required',
  },
  collectionPluralIdReq: {
    id: `${scope}.collectionPluralIdReq`,
    defaultMessage: 'Plural Id is required',
  },
  successfullySaved: {
    id: `${scope}.successfullySaved`,
    defaultMessage: 'Collection created successfully',
  },
  successfullypublished: {
    id: `${scope}.successfullypublished`,
    defaultMessage: 'Collection published successfully',
  },
  reqAuthToken: {
    id: `${scope}.reqAuthToken`,
    defaultMessage: 'Require Authentication Token',
  },
  isPublishable: {
    id: `${scope}.isPublishable`,
    defaultMessage: 'Is Publishable',
  },
  apiEndPointLabel: {
    id: `${scope}.apiEndPointLabel`,
    defaultMessage: 'API Endpoints:',
  },
  public: {
    id: `${scope}.public`,
    defaultMessage: 'Public',
  },
  protected: {
    id: `${scope}.protected`,
    defaultMessage: 'Protected',
  },
  areYouSureDelete: {
    id: `${scope}.areYouSureDelete`,
    defaultMessage: 'Are you sure you want to delete this field ?',
  },
  manageAccess: {
    id: `${scope}.manageAccess`,
    defaultMessage: 'Manage access',
  },
  publishStatus: {
    id: `${scope}.publishStatus`,
    defaultMessage: 'Publish Status :',
  },
  publishVersion: {
    id: `${scope}.publishVersion`,
    defaultMessage: 'Current Version :',
  },
  addNonLinkedField: {
    id: `${scope}.addNonLinkedField`,
    defaultMessage: 'Add atleast one non reference field.',
  },
  deleteCollectionType: {
    id: `${scope}.deleteCollectionType`,
    defaultMessage: 'Delete Collection Type',
  },
  succDelete: {
    id: `${scope}.succDelete`,
    defaultMessage: 'Collection Type was deleted.',
  },
  warningDelete: {
    id: `${scope}.warningDelete`,
    defaultMessage: 'Collection type contains items. Remove items to continue.',
  },
  errDelete: {
    id: `${scope}.errDelete`,
    defaultMessage: 'Collection type was not deleted due to unknown reason.',
  },
  successfullyDeletedAll: {
    id: `${scope}.successfullyDeletedAll`,
    defaultMessage: 'Collection type was succesffully deleted',
  },
  errorfullyDeletedAll: {
    id: `${scope}.errorfullyDeletedAll`,
    defaultMessage: 'Something went wrong while deleting collection type',
  },
  singular: {
    id: `${scope}.singular`,
    defaultMessage: 'Singular',
  },
  plural: {
    id: `${scope}.plural`,
    defaultMessage: 'Plural',
  },
});
