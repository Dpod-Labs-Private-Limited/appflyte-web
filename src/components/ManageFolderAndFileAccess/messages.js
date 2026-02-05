/*
 * ManageFolderAndFileAccess Messages
 *
 * This contains all the text for the ManageFolderAndFileAccess component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ManageFolderAndFileAccess';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'MANAGE ACCESS',
  },
  cancelBtn: {
    id: `${scope}.cancelBtn`,
    defaultMessage: 'Cancel',
  },
  saveBtn: {
    id: `${scope}.saveBtn`,
    defaultMessage: 'Done',
  },
  private: {
    id: `${scope}.private`,
    defaultMessage: 'Private',
  },
  public: {
    id: `${scope}.public`,
    defaultMessage: 'Public',
  },
  reqSubscription: {
    id: `${scope}.reqSubscription`,
    defaultMessage: 'Require Subscription',
  },
  accessChanged: {
    id: `${scope}.accessChanged`,
    defaultMessage: 'Access Changed',
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
});
