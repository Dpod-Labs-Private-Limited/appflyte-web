import { defineMessages } from 'react-intl';

export const scope = 'organizations';

export default defineMessages({
    invalid: {
        id: `${scope}.invalid`,
        defaultMessage: 'Invalid organization.',
    },
    no_record: {
        id: `${scope}.no_record`,
        defaultMessage: 'No records to display.',
    },
    service_error: {
        id: `${scope}.service_error`,
        defaultMessage: 'Service unavailable. Please try again.',
    }
});
