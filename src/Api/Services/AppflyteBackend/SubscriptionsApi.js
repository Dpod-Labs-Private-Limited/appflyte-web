import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscription_id = await fetchSubscriptionId();
    }

    getSubscriptions = async (last_evaluated_key) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.__auto_id__",
            field_value: this.subscription_id,
            operator: "eq"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/subscriptions?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=50&include_detail=false`)
    }

    getById = async (item_id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/subscription/${item_id}`)
    }

}

const SubscriptionsApi = new DpodAppFlyteApi();
export default SubscriptionsApi;