/*
 * CollectionListing Messages
 *
 * This contains all the text for the CollectionListing container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionListing';

export default defineMessages({
  createPlan: {
    id: `${scope}.createPlan`,
    defaultMessage: 'New Collection Type',
  },
  collectionTypes: {
    id: `${scope}.collectionTypes`,
    defaultMessage: 'Collection Types',
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
  share: {
    id: `${scope}.share`,
    defaultMessage: 'Share',
  },
  errorfullyDeletedAll: {
    id: `${scope}.errorfullyDeletedAll`,
    defaultMessage: 'Something went wrong while deleting collection Items',
  },
  publishedTab: {
    id: `${scope}.publishedTab`,
    defaultMessage: 'PUBLISHED',
  },
  draftTab: {
    id: `${scope}.draftTab`,
    defaultMessage: 'DRAFTS',
  },
  noCollection: {
    id: `${scope}.noCollection`,
    defaultMessage: 'No Collections',
  },
});
