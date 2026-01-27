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

    addData = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_extraction_triggerss`, reqObj)
    }

    getAll = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.project_id",
            field_value: project_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_extraction_triggerss?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getById = async (item_Id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_extraction_triggers/${item_Id}`)
    }

    delete = async (item_Id) => {
        await this.initialize();
        return AxiosObj.delete(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_extraction_triggers/${item_Id}`)
    }

    update = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_extraction_triggers/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }

    checkNameExistence = async (name) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.name",
            field_value: name,
            operator: "eq"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v7/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_extraction_triggerss?filters=${queyString}&include_detail=false&page_size=1000`)
    }

}

const ExtractionTriggerApi = new DpodAppFlyteApi();
export default ExtractionTriggerApi;