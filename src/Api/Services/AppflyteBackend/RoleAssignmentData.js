import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId } from "../../../utils/GetAccountDetails"

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
    }

    getAllRoleAssignments = async (last_evaluated_key, user_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.user",
            field_value: user_id,
            operator: "like"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/role_assignments?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

}

const RoleAssignmentApi = new DpodAppFlyteApi();
export default RoleAssignmentApi;