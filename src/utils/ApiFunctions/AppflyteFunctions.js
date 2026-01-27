import AppflyteFunctionApi from "../../Api/Services/AppflyteBackend/AppflyteFunction";

const getAppflyteFunctionsData = async () => {

    const getAllAppflyteFunctionsData = async () => {
        const tempArr = []
        let last_evaluated_key = null
        try {
            do {
                const response = await AppflyteFunctionApi.getAllAppflyteFunctions(last_evaluated_key);
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
        }
    }

    return getAllAppflyteFunctionsData();
};

export default getAppflyteFunctionsData;