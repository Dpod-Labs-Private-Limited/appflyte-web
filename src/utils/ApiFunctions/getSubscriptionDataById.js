import SubscriptionsApi from "../../Api/Services/AppflyteBackend/SubscriptionsApi";

const getSubscriptionById = async (item_id) => {
    try {
        const response = await SubscriptionsApi.getById(item_id);
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

export default getSubscriptionById;