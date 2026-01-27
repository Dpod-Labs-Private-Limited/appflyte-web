import AppflyteCostLogApi from "../../Api/Services/AppflyteBackend/AppflyteCostLogApi";

const getCostLogData = async (last_evaluated_key, organization_id) => {
    const tempArr = []
    try {
        const response = await AppflyteCostLogApi.fetchCostLogs(last_evaluated_key, organization_id);
        if (response.data) {
            const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
            if (collectionData) {
                tempArr.push(...collectionData)
            }
        }
        return {
            data: tempArr,
            lastEvaluatedKey: response.data?.last_evaluated_key ?? null
        };
    }
    catch (error) {
        console.error(error)
        return {
            data: tempArr,
            lastEvaluatedKey: null
        };
    }
}

export default getCostLogData;