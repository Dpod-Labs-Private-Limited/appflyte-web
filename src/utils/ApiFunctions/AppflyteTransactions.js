import AppflyteTransactionApi from "../../Api/Services/AppflyteBackend/AppflyteTransactionApi";

const getTransactionsData = async (last_evaluated_key, organization_id) => {
    const tempArr = []
    try {

        const response = await AppflyteTransactionApi.getAll(last_evaluated_key, organization_id);
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

export default getTransactionsData;
