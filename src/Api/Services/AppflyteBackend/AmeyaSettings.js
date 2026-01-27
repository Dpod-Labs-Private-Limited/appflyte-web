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

    addSettings = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_settingss`, reqObj)
    }

    getAllSettings = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.project_id",
            field_value: project_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_settingss?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getAllSettingsByOrg = async (last_evaluated_key, organization_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.organization_id",
            field_value: organization_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_settingss?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getSettingsById = async (project_id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_settings/${project_id}?include_detail=false`)
    }

    updateSettings = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya_settings/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }
    

}

const AmeyaSettingsApi = new DpodAppFlyteApi();
export default AmeyaSettingsApi;


