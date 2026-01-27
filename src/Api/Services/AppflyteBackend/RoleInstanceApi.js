import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId } from "../../../utils/GetAccountDetails"

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
    }

    getAllRoleInstances = async (last_evaluated_key, organization_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.organizations",
            field_value: organization_id,
            operator: "like"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/role_instances?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

}

const RoleInstanceApi = new DpodAppFlyteApi();
export default RoleInstanceApi;