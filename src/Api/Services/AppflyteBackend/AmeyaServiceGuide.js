import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"
import { AxiosObj } from "../../Configurations/axios-setup";
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

    add = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_service_guides`, reqObj)
    }

    getById = async (item_id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_service_guide/${item_id}`)
    }

    update = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_service_guide/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }

}

const AmeyaServiceGuideApi = new DpodAppFlyteApi();
export default AmeyaServiceGuideApi;