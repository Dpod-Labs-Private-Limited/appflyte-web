import { defineMessages } from 'react-intl';

export const scope = 'api_keys';

export default defineMessages({
    delete_success: {
        id: `${scope}.delete_success`,
        defaultMessage: 'Token deleted successfully.',
    },
    delete_error: {
        id: `${scope}.delete_error`,
        defaultMessage: 'Token deletion failed.',
    },
    add_success: {
        id: `${scope}.add_success`,
        defaultMessage: 'Token created successfully.',
    },
    add_error: {
        id: `${scope}.add_error`,
        defaultMessage: 'Token creation failed.',
    },
    selection_error: {
        id: `${scope}.selection_error`,
        defaultMessage: 'Cannot select a past date.',
    }
});
