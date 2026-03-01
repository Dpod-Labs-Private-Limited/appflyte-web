/*
 * CollectionTypesList Messages
 *
 * This contains all the text for the CollectionTypesList container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionTypesList';

export default defineMessages({
  createPlan: {
    id: `${scope}.createPlan`,
    defaultMessage: 'New Collection Type',
  },
  addFieldSet: {
    id: `${scope}.addFieldSet`,
    defaultMessage: 'New Field Set',
  },
  collectionTypes: {
    id: `${scope}.collectionTypes`,
    defaultMessage: 'Collection Types',
  },
  fieldSet: {
    id: `${scope}.fieldSet`,
    defaultMessage: 'Field Sets',
  },
  collectionTypesTab: {
    id: `${scope}.collectionTypesTab`,
    defaultMessage: 'COLLECTION TYPES',
  },
  fieldSetTab: {
    id: `${scope}.fieldSetTab`,
    defaultMessage: 'FIELD SETS',
  },
  lastPublished: {
    id: `${scope}.lastPublished`,
    defaultMessage: 'Last Published',
  },
  search: {
    id: `${scope}.search`,
    defaultMessage: 'Search',
  },
  draft: {
    id: `${scope}.draft`,
    defaultMessage: ' - DRAFT',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  succDelete: {
    id: `${scope}.succDelete`,
    defaultMessage: 'Collection Types were deleted.',
  },
  warningDelete: {
    id: `${scope}.warningDelete`,
    defaultMessage: 'Collection types contains items. Remove items to continue.',
  },
  errDelete: {
    id: `${scope}.errDelete`,
    defaultMessage: 'Collection types were not deleted due to unknown reasons.',
  },
  successfullyDeletedAll: {
    id: `${scope}.successfullyDeletedAll`,
    defaultMessage: 'Collection types were succesffully deleted',
  },
  errorfullyDeletedAll: {
    id: `${scope}.errorfullyDeletedAll`,
    defaultMessage: 'Something went wrong while deleting collection types',
  },
});
