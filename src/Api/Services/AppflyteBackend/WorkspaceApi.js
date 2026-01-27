import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId } from "../../../utils/GetAccountDetails"
import UpdateHeaders from "../../Configurations/UpdateHeaders";

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
    }

    checkNameExistence = async (space_name) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.name",
            field_value: space_name,
            operator: "eq"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v7/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_workspaces?filters=${queyString}&include_detail=false&page_size=1000`)
    }

    createWorkspace = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_workspaces`, reqObj)
    }

    getAllWorkspaces = async (last_evaluated_key, organization_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.organization_id",
            field_value: organization_id,
            operator: "like"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_workspaces?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    updateSpace = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_workspace/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }

}

const WorkspaceApi = new DpodAppFlyteApi();
export default WorkspaceApi;


