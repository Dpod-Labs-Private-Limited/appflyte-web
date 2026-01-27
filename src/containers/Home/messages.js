import { defineMessages } from 'react-intl';

export const scope = 'home_layout';

export default defineMessages({
    loading: {
        id: `${scope}.loading`,
        defaultMessage: 'Please wait while we load your information...',
    },
    error: {
        id: `${scope}.error`,
        defaultMessage: 'You do not appear to be assigned to any organization yet. Please contact your administrator to get started.',
    }
});
