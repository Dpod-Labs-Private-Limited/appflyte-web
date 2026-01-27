import { AxiosAnalyticsObj, AxiosAppflyteAnServiceObj } from "../../Configurations/axios-ameya-setup";
import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails"

class AmeyaBackendApi {

    constructor() {
        this.accountId = null;
        this.subscribeId = null;
        this.subscriptionId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscriberId = await fetchSubscriberId();
        this.subscriptionId = await fetchSubscriptionId();
    }

    // Mongo SourceApi
    mongoConnectionDBLists = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/mongo-list-connection-dbs`, reqObj)
    }

    mongoConnectionCollectionsLists = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/mongo-list-connection-collections`, reqObj)
    }

    mongoUserConnectionRegister = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/mongo-user-connection-register`, reqObj)
    }

    createMongoIndex = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/create-mongo-index`, reqObj)
    }

    createMongoFieldIndex = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/create-mongo-field-index`, reqObj)
    }

    getJobStatus = async (job_id) => {
        await this.initialize();
        return AxiosAnalyticsObj.get(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/job-status`,
            { params: { job_id: job_id } }
        )
    }

    getSourceDetails = async () => {
        await this.initialize();
        return AxiosAnalyticsObj.get(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/query-engine/event/source-details`)
    }

    getListOfConnetions = async () => {
        await this.initialize();
        return AxiosAnalyticsObj.get(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/get-list-of-connections`)
    }

    updateSourceConnetion = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.put(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/update-connection-status`, reqObj)
    }

    deleteSourceConnetion = async (source_id) => {
        await this.initialize();
        return AxiosAnalyticsObj.delete(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/delete-connection?source_id=${source_id}`)
    }

    // Appflyte Source Api
    createAppflyteSource = async (reqObj) => {
        await this.initialize();
        return AxiosAppflyteAnServiceObj.post(`create/sources/subscriber_id/${this.subscriberId}/subscription_id/${this.subscriptionId}`, reqObj)
    }

    // DatasetApi
    createDataset = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/create-data-set`, reqObj)
    }

    updateDataset = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.put(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/update-data-set`, reqObj)
    }

    deleteDataset = async (datasetId) => {
        await this.initialize();
        return AxiosAnalyticsObj.delete(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/delete-data-set?dataset_id=${datasetId}`)
    }

    checkDatasetStatus = async (datasetId) => {
        await this.initialize();
        return AxiosAnalyticsObj.get(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/dataset-status?dataset_id=${datasetId}`)
    }

    createDatasetDescription = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/create-dataset-description`, reqObj)
    }

    // FilesSourceApi 
    deleteFileDataset = async (dataset_id) => {
        await this.initialize();
        return AxiosAnalyticsObj.delete(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/dataset-delete?dataset_id=${dataset_id}`)
    }

    deleteFileDatasource = async (dataset_id, document_checksum) => {
        await this.initialize();
        return AxiosAnalyticsObj.delete(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/file-delete?dataset_id=${dataset_id}&document_checksum=${document_checksum}`)
    }

    uploadFile = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/file-upload`, reqObj)
    }

    getFileList = async () => {
        await this.initialize();
        return AxiosAnalyticsObj.get(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/get-files-list`)
    }

    fileGrouping = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/file-grouping`, reqObj)
    }

    deleteFile = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.delete(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/data-processing/event/file-delete`, {
            data: reqObj
        })
    }

    // ai apps:
    createAiApp = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/create-app`, reqObj)
    }

    deleteAiApp = async (app_id) => {
        await this.initialize();
        return AxiosAnalyticsObj.delete(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/delete-app?app_id=${app_id}`)
    }

    updateAiApp = async (reqObj) => {
        await this.initialize();
        return AxiosAnalyticsObj.put(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/function/user-management/event/update-app`, reqObj)
    }

}

const AnalyticsApi = new AmeyaBackendApi();
export default AnalyticsApi;

