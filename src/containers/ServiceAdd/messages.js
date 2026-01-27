import { defineMessages } from 'react-intl';

export const scope = 'service_add';

export default defineMessages({
    service_error: {
        id: `${scope}.service_error`,
        defaultMessage: 'Failed to create service. Please try again.',
    },
    workspace_error: {
        id: `${scope}.workspace_error`,
        defaultMessage: 'Failed to create workspace. Please try again.',
    },
    project_error: {
        id: `${scope}.project_error`,
        defaultMessage: 'Failed to create project. Please try again.',
    },
    service_success: {
        id: `${scope}.service_success`,
        defaultMessage: 'Service creation successful.',
    }
});
