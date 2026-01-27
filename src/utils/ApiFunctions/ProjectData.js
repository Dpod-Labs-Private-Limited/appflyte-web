import ProjectsApi from "../../Api/Services/AppflyteBackend/ProjectsApi";

const getProjectData = async (organization_id) => {

    const getAllProjectData = async () => {
        const tempArr = []
        let last_evaluated_key = null
        try {
            do {
                const response = await ProjectsApi.getAllProjects(last_evaluated_key, organization_id);
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

    return getAllProjectData();
};

export default getProjectData;