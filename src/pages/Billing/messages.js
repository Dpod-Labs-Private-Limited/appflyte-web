import { defineMessages } from 'react-intl';

export const scope = 'billing';

export default defineMessages({
    invalid_amount: {
        id: `${scope}.invalid_amount`,
        defaultMessage: 'Invalid amount.',
    },
    amount_error: {
        id: `${scope}.amount_error`,
        defaultMessage: 'Amount must be at least',
    },
    transaction_error: {
        id: `${scope}.transaction_error`,
        defaultMessage: 'Transaction failed.',
    }
});
