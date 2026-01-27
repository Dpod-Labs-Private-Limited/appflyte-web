import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId } from "../../../utils/GetAccountDetails"

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
    }

    fetchCostLogs = async (last_evaluated_key, organization_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.organization_id",
            field_value: organization_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        const lastKeyParam = last_evaluated_key ? encodeURIComponent(JSON.stringify(last_evaluated_key)) : null;
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_cost_logss?filters=${filter}&last_evaluated_key=${lastKeyParam}&page_size=1000&include_detail=false`)
    }

}

const AppflyteCostLogApi = new DpodAppFlyteApi();
export default AppflyteCostLogApi;