/*
 * CollectionTypeAddFieldSet Messages
 *
 * This contains all the text for the CollectionTypeAddFieldSet container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CollectionTypeAddFieldSet';

export default defineMessages({
  successfullySubscribed: {
    id: `${scope}.successfullySubscribed`,
    defaultMessage: 'App subscribed successfully',
  },
  subscribeFail: {
    id: `${scope}.subscribeFail`,
    defaultMessage: 'Failed to subscribe app, try again later',
  },
});
