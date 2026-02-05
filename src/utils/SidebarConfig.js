export const handleSidebarConfig = async (selectedWorkspace, selectedProject, navigate) => {

    const sidebar_config_order = selectedProject?.payload?.configuration?.engine_config?.sidebar_items ?? [];
    const main_sidebar_order = ['service_home'];

    const sidebar_order = [...Object?.keys(sidebar_config_order)];

    const sortSidebarItems = sidebar_order.slice().sort((a, b) => {
        const indexA = main_sidebar_order.indexOf(a);
        const indexB = main_sidebar_order.indexOf(b);
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });

    const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;
    const project_id = selectedProject?.payload?.__auto_id__ ?? null;

    switch (sortSidebarItems?.[0]) {
        case 'service_home':
            navigate(`/workspace/${workspace_id}/project/${project_id}/collection-types`)
            break;
        default:
            navigate(`/workspace/${workspace_id}/project/${project_id}/collection-types`)
    }
    return
}