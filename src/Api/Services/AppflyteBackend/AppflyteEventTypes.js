import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId } from "../../../utils/GetAccountDetails"

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
    }

    getAllAppflyteEventTypes = async (last_evaluated_key) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_event_types?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=500&include_detail=false`)
    }

}

const AppflyteEventTypesApi = new DpodAppFlyteApi();
export default AppflyteEventTypesApi;