import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
        this.subscriber_id = null;
        this.subscription_id = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscriber_id = await fetchSubscriberId();
        this.subscription_id = await fetchSubscriptionId()
    }

    addTrigger = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/account/${this.accountId}/subscriber/${this.subscriber_id}/subscription/${this.subscription_id}/analytics_dataset`, reqObj)
    }

}

const ExtractionAnalyticsApi = new DpodAppFlyteApi();
export default ExtractionAnalyticsApi;


