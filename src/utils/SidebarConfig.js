import { UTIL_CONFIG } from ".";

export const handleSidebarConfig = async (selectedWorkspace, selectedProject, navigate, authData, updateAuthData, initialAuthData) => {

    const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;
    const project_id = selectedProject?.payload?.__auto_id__ ?? null;
    let path = null;

    const { user_type, request_type, collection_service_type } = authData;
    const isSupportedService = collection_service_type && UTIL_CONFIG.SUPPORTED_SERVICES.includes(collection_service_type);

    if (user_type === UTIL_CONFIG.EXT_USER_TYPE && request_type === UTIL_CONFIG.USER_REQUEST && isSupportedService) {
        if (collection_service_type === UTIL_CONFIG.DDL_SERVICE) {
            updateAuthData(initialAuthData)
            path = 'collection_types'
        }

        if (collection_service_type === UTIL_CONFIG.DML_SERVICE) {
            updateAuthData(initialAuthData)
            path = 'collections'
        }
    }

    switch (path) {
        case 'collection_types':
            navigate(`/workspace/${workspace_id}/project/${project_id}/collection-types`)
            break;
        case 'collections':
            navigate(`/workspace/${workspace_id}/project/${project_id}/collections`)
            break;
        default:
            navigate(`/workspace/${workspace_id}/project/${project_id}/collection-types`)
    }
    return
}