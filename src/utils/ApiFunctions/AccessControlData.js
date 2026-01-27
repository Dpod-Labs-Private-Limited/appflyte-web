import RoleAssignmentApi from "../../Api/Services/AppflyteBackend/RoleAssignmentData";
import RoleInstanceApi from "../../Api/Services/AppflyteBackend/RoleInstanceApi";

export const getAllRoleInstanceData = async (organization_id) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await RoleInstanceApi.getAllRoleInstances(last_evaluated_key, organization_id);
            if (response.data) {
                const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
                if (collectionData) {
                    tempArr.push(...collectionData)
                }
            }
            last_evaluated_key = response.data.last_evaluated_key != null && response.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(response.data.last_evaluated_key)) : null
        }
        while (last_evaluated_key !== null)
        return tempArr;
    }
    catch (error) {
        console.error(error)
        return []
    }
}

export const getAllRoleAssignmentData = async (user_id) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await RoleAssignmentApi.getAllRoleAssignments(last_evaluated_key, user_id);
            if (response.data) {
                const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
                if (collectionData) {
                    tempArr.push(...collectionData)
                }
            }
            last_evaluated_key = response.data.last_evaluated_key != null && response.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(response.data.last_evaluated_key)) : null
        }
        while (last_evaluated_key !== null)
        return tempArr;
    }
    catch (error) {
        console.error(error)
        return []
    }
}
