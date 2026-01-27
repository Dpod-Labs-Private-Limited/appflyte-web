import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"
import UpdateHeaders from "../../Configurations/UpdateHeaders";

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
        this.subscribeId = null;
        this.subscriptionId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscriberId = await fetchSubscriberId();
        this.subscriptionId = await fetchSubscriptionId();
    }

    createApp = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_ai_appss`, reqObj)
    }

    getAllAiApps = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.project_id",
            field_value: project_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_ai_appss?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getAiAppById = async (item_Id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_ai_apps/${item_Id}`)
    }

    updateAiApp = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_ai_apps/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }

    deleteApp = async (item_Id) => {
        await this.initialize();
        return AxiosObj.delete(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_ai_apps/${item_Id}`)
    }

}

const AiAppsApi = new DpodAppFlyteApi();
export default AiAppsApi;


