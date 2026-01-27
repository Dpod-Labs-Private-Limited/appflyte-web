import TemplateExtractionApi from "../../Api/Services/AppflyteBackend/TemplateExtractionApi";

export const getAllExtractionSchemas = async () => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await TemplateExtractionApi.getMainExtractionSchemas(last_evaluated_key);
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
};

export const getDoctypeSchema = async (document_type_id) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await TemplateExtractionApi.getDocTypeSchema(last_evaluated_key, document_type_id);
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
