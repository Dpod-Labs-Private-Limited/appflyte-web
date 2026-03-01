import { AxiosObj, AxiosBaseObj } from "../../Configurations/axios-setup";
import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"
import UpdateHeaders from "../../Configurations/UpdateHeaders";

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
        this.subscribeId = null;
        this.subscriptionId = null;
        this.schemaId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscriberId = await fetchSubscriberId();
        this.subscriptionId = await fetchSubscriptionId();
        this.schemaId = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID
    }

    createApp = async (reqObj) => {
        await this.initialize();
        return AxiosBaseObj.post(`api/ameya/account/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/schema/${this.schemaId}/bug_tracker_setup`, reqObj)
    }

    getAllAiApps = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{ field_name: "payload.project_id", field_value: project_id, operator: "eq" }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${this.schemaId}/appflyte_appss?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getAppById = async (item_Id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${this.schemaId}/appflyte_apps/${item_Id}`)
    }

}

const AppflyteAppsApi = new DpodAppFlyteApi();
export default AppflyteAppsApi;


