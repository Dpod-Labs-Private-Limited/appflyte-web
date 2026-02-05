/*
 * CollectionDeleteWarning Messages
 *
 * This contains all the text for the CollectionDeleteWarning component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionDeleteWarning';

export default defineMessages({
  titleCollection: {
    id: `${scope}.titleCollection`,
    defaultMessage: 'COLLECTION TYPE DELETE',
  },
  titleFieldSet: {
    id: `${scope}.titleFieldSet`,
    defaultMessage: 'FIELD SET DELETE',
  },
  collectionType: {
    id: `${scope}.collectionType`,
    defaultMessage: 'Collection Type',
  },
  fieldSet: {
    id: `${scope}.fieldSet`,
    defaultMessage: 'Field Set',
  },
  depFieldSet: {
    id: `${scope}.depFieldSet`,
    defaultMessage: 'Dependent Field Set',
  },
  depCollectionType: {
    id: `${scope}.depCollectionType`,
    defaultMessage: 'Dependent Collection Type',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  itemsDeleted: {
    id: `${scope}.itemsDeleted`,
    defaultMessage: 'Items were deleted',
  },
  theseItemsWarning: {
    id: `${scope}.theseItemsWarning`,
    defaultMessage: 'There are child items for the following collection types and could not be deleted. Resolve the dependencies and try again.',
  },
  theseItemsError: {
    id: `${scope}.theseItemsError`,
    defaultMessage: 'These items were not deleted due to unknown error.',
  },
  resolveNow: {
    id: `${scope}.resolveNow`,
    defaultMessage: 'Resolve Now',
  },
  relationDefined: {
    id: `${scope}.relationDefined`,
    defaultMessage: 'There are depedencies on the following collection types and could not be deleted. Resolve the dependencies and try again.',
  },
  resolveTheIssue: {
    id: `${scope}.resolveTheIssue`,
    defaultMessage: 'These items were not deleted. Resolve these issues to continue',
  },
  innerFieldSetItems: {
    id: `${scope}.innerFieldSetItems`,
    defaultMessage: 'There are inner field sets inside these field sets. Resolve the dependencies and try again.',
  },
  removeRefeFieldSet: {
    id: `${scope}.removeRefeFieldSet`,
    defaultMessage: 'There are depedencies on the following field sets and could not be deleted. Resolve the dependencies and try again.',
  },
  removeRefeFieldSetColl: {
    id: `${scope}.removeRefeFieldSetColl`,
    defaultMessage: 'There are depedencies on the following field sets and could not be deleted. Resolve the dependencies and try again.',
  },
});
