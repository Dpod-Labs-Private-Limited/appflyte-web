import AmeyaServiceGuideApi from "../../Api/Services/AppflyteBackend/AmeyaServiceGuide";

const getAmeyaServiceGuideById = async (item_id) => {
    try {
        const response = await AmeyaServiceGuideApi.getById(item_id);
        const responseData = response?.data ?? null;
        if (responseData) {
            return responseData;
        }
        return null;
    }
    catch (error) {
        console.error(error)
        return null
    }
}

export default getAmeyaServiceGuideById;