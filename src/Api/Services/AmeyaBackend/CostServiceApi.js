import { AxiosCostUsageServiceObj } from "../../Configurations/axios-ameya-setup";
import { fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"

class AmeyaBackendApi {

    constructor() {
        this.subscribeId = null;
        this.subscriptionId = null;
    }

    async initialize() {
        this.subscriberId = await fetchSubscriberId();
        this.subscriptionId = await fetchSubscriptionId();
    }


    getAll = async (reqObj, current_page, page_size) => {
        await this.initialize();
        return AxiosCostUsageServiceObj.post(`/subscriber_id/${this.subscriberId}/subscription_id/${this.subscriptionId}/function/get_token_usage/event/calculate_cost?page_size=${page_size}&current_page=${current_page}`, reqObj);
    };


}

const CostServiceApi = new AmeyaBackendApi();
export default CostServiceApi;