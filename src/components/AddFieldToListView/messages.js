/*
 * AddFieldToListView Messages
 *
 * This contains all the text for the AddFieldToListView component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AddFieldToListView';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'ADD A FIELD TO LIST VIEW',
  },
  heading2: {
    id: `${scope}.heading2`,
    defaultMessage: 'ADD A FIELD TO EDIT VIEW',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'OK ',
  },
  linkFieldToEdit: {
    id: `${scope}.linkFieldToEdit`,
    defaultMessage: 'Link Field to Edit View',
  },
  searchAfield: {
    id: `${scope}.searchAfield`,
    defaultMessage: 'Link Field to Edit View',
  },
});
