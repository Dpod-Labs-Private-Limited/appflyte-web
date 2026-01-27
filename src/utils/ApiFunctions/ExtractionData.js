import TemplateExtractionApi from "../../Api/Services/AppflyteBackend/TemplateExtractionApi";

export const getAllExtractionDocumentTypes = async (project_id) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await TemplateExtractionApi.getDocumentTypes(last_evaluated_key, project_id);
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

export const getAllMainExtractionDocumentTypes = async () => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await TemplateExtractionApi.getMainDocumentTypes(last_evaluated_key);
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
