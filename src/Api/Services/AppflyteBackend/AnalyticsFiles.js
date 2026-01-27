import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"
import { AxiosObj } from "../../Configurations/axios-setup";

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

    addFile = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_filess`, reqObj)
    }

    getFilesByDataset = async (last_evaluated_key, datasetId) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.dataset_id",
            field_value: datasetId,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_filess?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    delete = async (item_Id) => {
        await this.initialize();
        return AxiosObj.delete(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_analytics_files/${item_Id}`)
    }


}

const AnalyticsFilesApi = new DpodAppFlyteApi();
export default AnalyticsFilesApi;