/*
 * CollectionItem Messages
 *
 * This contains all the text for the CollectionItem component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CollectionItem';

export default defineMessages({
  permission: {
    id: `${scope}.permission`,
    defaultMessage: 'Permisison',
  },
  restricted: {
    id: `${scope}.restricted`,
    defaultMessage: 'Restricted',
  },
  public: {
    id: `${scope}.public`,
    defaultMessage: 'Public',
  },
  true: {
    id: `${scope}.true`,
    defaultMessage: 'True',
  },
  fieldIsRequired: {
    id: `${scope}.fieldIsRequired`,
    defaultMessage: 'Field is required',
  },
  false: {
    id: `${scope}.false`,
    defaultMessage: 'False',
  },
  onlyIntAllowed: {
    id: `${scope}.onlyIntAllowed`,
    defaultMessage: 'Only integer allowed',
  },
  invalidEmail: {
    id: `${scope}.invalidEmail`,
    defaultMessage: 'Invalid email',
  },
});
