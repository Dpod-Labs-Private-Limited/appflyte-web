import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId } from "../../../utils/GetAccountDetails"
import { AxiosStripeServiceObj } from "../../Configurations/axios-ameya-setup";

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
    }

    getAll = async (last_evaluated_key, organization_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.organization_id",
            field_value: organization_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        const lastKeyParam = last_evaluated_key ? encodeURIComponent(JSON.stringify(last_evaluated_key)) : null;
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/transaction_detailss?filters=${filter}&last_evaluated_key=${lastKeyParam}&page_size=1000&include_detail=false`)
    }

    createSession = async (reqObj) => {
        await this.initialize();
        return AxiosStripeServiceObj.post('/create-checkout-session', reqObj)
    }

    getCreditBundles = async (organization_id) => {
        return AxiosStripeServiceObj.get(`/get-credit-bundles/organization/${organization_id}`)
    }

    getBalanceDetails = async (organization_id) => {
        return AxiosStripeServiceObj.get(`/get-credit-balance/${organization_id}`)
    }

    getFreeCredit = async (reqObj) => {
        return AxiosStripeServiceObj.post(`/get-free-credits`, reqObj)
    }
}

const AppflyteTransactionApi = new DpodAppFlyteApi();
export default AppflyteTransactionApi;