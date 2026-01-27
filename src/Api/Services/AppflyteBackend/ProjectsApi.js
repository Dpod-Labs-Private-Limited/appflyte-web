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

    checkNameExistence = async (project_name) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.name",
            field_value: project_name,
            operator: "eq"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v7/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_projects?filters=${queyString}&include_detail=false&page_size=1000`)
    }

    createProject = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_projects`, reqObj)
    }

    getAllProjects = async (last_evaluated_key, organization_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.organization_id",
            field_value: organization_id,
            operator: "like"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_projects?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getProjectById = async (project_id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_project/${project_id}`)
    }

    updateProject = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/appflyte_project/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }
}

const ProjectsApi = new DpodAppFlyteApi();
export default ProjectsApi;


