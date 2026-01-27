import { defineMessages } from 'react-intl';

export const scope = 'project_add';

export default defineMessages({
    service_error: {
        id: `${scope}.service_error`,
        defaultMessage: 'Service unavailable. Please try again.',
    },
    project_check: {
        id: `${scope}.project_check`,
        defaultMessage: 'A project with this name already exists.',
    },
    project_add: {
        id: `${scope}.project_add`,
        defaultMessage: 'Project created successfully.',
    },
    project_update: {
        id: `${scope}.project_update`,
        defaultMessage: 'Project updated successfully.',
    },
    project_add_error: {
        id: `${scope}.project_add_error`,
        defaultMessage: 'Failed to create project. Please try again.',
    },
    project_update_error: {
        id: `${scope}.project_update_error`,
        defaultMessage: 'Failed to update project. Please try again.',
    }
});
