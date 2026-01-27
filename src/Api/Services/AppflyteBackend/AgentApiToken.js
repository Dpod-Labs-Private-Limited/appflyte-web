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

    createAgentApiToken = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/api/ameya/${this.accountId}/subscriber/${this.subscriber_id}/subscription/${this.subscription_id}/schema_id/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/create_agent_api_token`, reqObj)
    }

    createAgentApiOrgToken = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/api/ameya/account/${this.accountId}/subscriber/${this.subscriber_id}/subscription/${this.subscription_id}/schema/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/create_agent_api_org_token`, reqObj)
    }

    getAllAgentTokens = async (last_evaluated_key) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/agent_api_tokens?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    deleteToken = async (item_Id) => {
        await this.initialize();
        return AxiosObj.delete(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/agent_api_token/${item_Id}`)
    }

}

const AgentApiToken = new DpodAppFlyteApi();
export default AgentApiToken;


