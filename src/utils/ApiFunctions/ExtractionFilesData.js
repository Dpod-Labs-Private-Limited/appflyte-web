import TemplateExtractionApi from "../../Api/Services/AppflyteBackend/TemplateExtractionApi";

export const ExtractionFilesData = async (last_evaluated_key, project_id) => {
    const tempArr = []
    try {
        const response = await TemplateExtractionApi.fetchExtractionFiles(last_evaluated_key, project_id);
        if (response.data) {
            const collectionData = response.data.published_collections_detail?.flatMap(collection => response.data[collection.id]) ?? [];
            if (collectionData.length) {
                tempArr.push(...collectionData);
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
};

export default ExtractionFilesData;