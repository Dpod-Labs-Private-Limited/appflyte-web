import AmeyaSettingsApi from "../../Api/Services/AppflyteBackend/AmeyaSettings";

const getAmeyaSettingsById = async (projectId) => {
    try {
        const response = await AmeyaSettingsApi.getSettingsById(projectId);
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

export default getAmeyaSettingsById;