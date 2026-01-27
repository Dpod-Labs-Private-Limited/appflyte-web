import AmeyaSettingsApi from "../../Api/Services/AppflyteBackend/AmeyaSettings";

const getAmeyaSettingsDataByOrg = async (orgId) => {

    const getAllAmeyaSettingsDataByOrg = async (orgId) => {
        const tempArr = []
        let last_evaluated_key = null
        try {
            do {
                const response = await AmeyaSettingsApi.getAllSettingsByOrg(last_evaluated_key, orgId);
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
            throw error
        }
    }

    return getAllAmeyaSettingsDataByOrg(orgId);
};

export default getAmeyaSettingsDataByOrg;