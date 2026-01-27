export const handleSidebarConfig = async (selected_project, navigate, authData) => {

    const sidebar_config_order = selected_project?.payload?.configuration?.engine_config?.sidebar_items ?? [];
    const main_sidebar_order = ['service_home'];

    const sidebar_order = [...Object?.keys(sidebar_config_order)];

    const sortSidebarItems = sidebar_order.slice().sort((a, b) => {
        const indexA = main_sidebar_order.indexOf(a);
        const indexB = main_sidebar_order.indexOf(b);
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });

    const engine_name = selected_project?.payload?.configuration?.engine_name ?? null;

    switch (sortSidebarItems?.[0]) {
        case 'service_home':
            switch (engine_name) {
                case "extraction_agent":
                    const requestType = authData?.request_type ?? null;
                    navigate((requestType === "ext_existing_user" || requestType === "ext_user_singin") ? "/document-types" : "/extraction-home");
                    break;

                case "analytics_tool":
                    navigate('/analytics-home');
                    break;

                default: navigate("/")
            }
            break;

        default:
            return
    }
    return
}