import { defineMessages } from 'react-intl';

export const scope = 'services';

export default defineMessages({
    invalid: {
        id: `${scope}.no_record`,
        defaultMessage: 'Service unavailable. Please try again.',
    },
    loading: {
        id: `${scope}.loading`,
        defaultMessage: 'Please wait while we load your information...',
    },
});
