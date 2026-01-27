import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"
import { AxiosExtractionObj } from "../../Configurations/axios-ameya-setup";
import { AxiosObj } from "../../Configurations/axios-setup";
import { makeCancellableRequest } from "../../Configurations/CancelApi";
import UpdateHeaders from "../../Configurations/UpdateHeaders";

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
        this.subscribeId = null;
        this.subscriptionId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscribeId = await fetchSubscriberId();
        this.subscriptionId = await fetchSubscriptionId();
    }

    // Extarction Document Types
    createExtractionDocumentTypes = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_document_typess`, reqObj)
    }

    getDocumentTypes = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.project_id",
            field_value: project_id,
            operator: "eq"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_document_typess?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getMainDocumentTypes = async (last_evaluated_key) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_main_document_typess?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    checkNameExistence = async (name) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.name",
            field_value: name,
            operator: "eq"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v7/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_document_typess?filters=${queyString}&include_detail=false&page_size=1000`)
    }


    // Extraction Files
    uploadExtractionFile = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_filess`, reqObj)
    }

    fetchExtractionFiles = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.project_id",
            field_value: project_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        const lastKeyParam = last_evaluated_key ? encodeURIComponent(JSON.stringify(last_evaluated_key)) : null;
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_filess?filters=${filter}&last_evaluated_key=${lastKeyParam}&page_size=1000&include_detail=false`)
    }

    getExtractionFileById = async (file_id, last_evaluated_key) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.__auto_id__",
            field_value: file_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/public/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_filess?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    getExtractionFileByFileId = async (file_id, last_evaluated_key) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.file_id",
            field_value: file_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/public/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_filess?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    deleteExtractionFile = async (item_Id) => {
        await this.initialize();
        return AxiosObj.delete(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_files/${item_Id}`)
    }


    // extarction tasks
    fetchExtractionTasks = async (last_evaluated_key, project_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.project_id",
            field_value: project_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        const lastKeyParam = last_evaluated_key ? encodeURIComponent(JSON.stringify(last_evaluated_key)) : null;
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_tasks?filters=${filter}&last_evaluated_key=${lastKeyParam}&page_size=1000&include_detail=false`)
    }

    fetchExtractionTaskData = async (last_evaluated_key) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_tasks?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=3&include_detail=false`)
    }

    updateTask = async (reqObj, item_Id, updatekey) => {
        await this.initialize();
        const { hashHex, etagRandomNumber } = await UpdateHeaders(updatekey);
        return AxiosObj.put(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_task/${item_Id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }

    updateExtractionTask = async (reqObj, file_name) => {
        await this.initialize();
        return AxiosExtractionObj.post(`/user/subscriber/${this.subscribeId}/subscription/${this.subscriptionId}/function/extraction/event/approve-extracted-entities?source_filename=${encodeURIComponent(file_name)}`, reqObj)
    }

    //  extraction Schemas
    getMainExtractionSchemas = async (last_evaluated_key) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_main_schemas?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    createExtractionSchema = async (reqObj) => {
        await this.initialize();
        return AxiosObj.post(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_schemas`, reqObj)
    }

    // platformFiles
    getExtractionPlatformFile = async (item_Id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/platform_file/${item_Id}`)
    }

    getDocTypeSchema = async (last_evaluated_key, document_type_id) => {
        await this.initialize();
        const queryObj = [{
            field_name: "payload.document_type",
            field_value: document_type_id,
            operator: "eq"
        }]
        const filter = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/public/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/extraction_schemas?filters=${filter}&last_evaluated_key=${last_evaluated_key}&page_size=1000&include_detail=false`)
    }

    startExtraction = async (reqObj) => {
        await this.initialize();
        const url = `/user/subscriber/${this.subscribeId}/subscription/${this.subscriptionId}/function/pipeline/event/execute?pipeline_id=${process.env.REACT_APP_TEMPLATE_EXTRACTION_PIPELINE_ID}`
        const response = await makeCancellableRequest(AxiosExtractionObj, { method: 'POST', url, data: reqObj });
        return response;
    }

    fetchLayout = async (reqObj, source_filename) => {
        await this.initialize();
        const url = `/user/subscriber/${this.subscribeId}/subscription/${this.subscriptionId}/function/extraction/event/fetch-entities-v2?source_filename=${encodeURIComponent(source_filename)}`
        const response = await makeCancellableRequest(AxiosExtractionObj, { method: 'POST', url, data: reqObj });
        return response;
    }

    getPipelineStatus = async (pipeline_exec_id) => {
        await this.initialize();
        const url = `/user/subscriber/${this.subscribeId}/subscription/${this.subscriptionId}/function/pipeline/event/status?pipeline_exec_id=${pipeline_exec_id}`
        const response = await makeCancellableRequest(AxiosExtractionObj, { method: 'GET', url });
        return response;
    }

}

const TemplateExtractionApi = new DpodAppFlyteApi();
export default TemplateExtractionApi;