import ServicesApi from "../../Api/Services/AppflyteBackend/ServicesApi";

export const getServicesByOrganization = async (organization_id) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await ServicesApi.getByOrganizations(last_evaluated_key, organization_id);
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
        return null;
    }
};

export const getServicesById = async (service_id) => {
    try {
        const response = await ServicesApi.getById(service_id);
        const responseData = response?.data ?? null;
        if (responseData) {
            return responseData;
        } return null;
    }
    catch (error) {
        console.error(error)
        return null
    }
};

export const getAllServices = async () => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await ServicesApi.getAll(last_evaluated_key);
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
        return error
    }
};


