import { defineMessages } from 'react-intl';

export const scope = 'workspace_add';

export default defineMessages({
    workspace_check: {
        id: `${scope}.workspace_check`,
        defaultMessage: 'A workspace with this name already exists.',
    },
    workspace_add: {
        id: `${scope}.workspace_add`,
        defaultMessage: 'Workspace created successfully.',
    },
    workspace_update: {
        id: `${scope}.workspace_update`,
        defaultMessage: 'Workspace updated successfully.',
    },
    workspace_add_error: {
        id: `${scope}.workspace_add_error`,
        defaultMessage: 'Failed to create workspace. Please try again.',
    },
    workspace_update_error: {
        id: `${scope}.workspace_update_error`,
        defaultMessage: 'Failed to update workspace. Please try again.',
    }
});
