export const AppflyteWorkspacePermissions = (resources, roleInstances, roleAssignments, isOrganizationOwner) => {

    if (!roleAssignments?.length || !roleInstances?.length || !resources?.length) {
        return [];
    }

    if (isOrganizationOwner) {
        return resources
    }

    const assignedRoleIds = new Set(roleAssignments.map(item => item?.payload?.role_instance?.at(-1)).filter(Boolean));
    const permittedWorkspaceIds = new Set(roleInstances.filter(item => assignedRoleIds.has(item?.payload?.__auto_id__))
        .map(item => item?.payload?.appflyte_workspaces?.at(-1))
        .filter(Boolean)
    );
    return resources.filter(resource => permittedWorkspaceIds.has(resource?.payload?.__auto_id__));
}

export const AppflyteProjectPermissions = (resources, roleInstances, roleAssignments, isOrganizationOwner) => {

    if (!roleAssignments?.length || !roleInstances?.length || !resources?.length) {
        return [];
    }


    if (isOrganizationOwner) {
        return resources
    }

    const assignedRoleIds = new Set(roleAssignments.map(item => item?.payload?.role_instance?.at(-1)).filter(Boolean));
    const permittedProjectIds = new Set(roleInstances.filter(item => assignedRoleIds.has(item?.payload?.__auto_id__))
        .map(item => item?.payload?.appflyte_projects?.at(-1))
        .filter(Boolean)
    );
    return resources.filter(resource => permittedProjectIds.has(resource?.payload?.__auto_id__));
}