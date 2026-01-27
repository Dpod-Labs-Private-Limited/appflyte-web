import { AxiosMonitoringServiceObj } from "../../Configurations/axios-ameya-setup";
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

    // Extraction Monitoring Service:
    createService = async (reqObj, project_id) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/project_id/${project_id}/create/monitor/service`, reqObj)
    }

    getAllExtractionTrigger = async () => {
        await this.initialize();
        return AxiosMonitoringServiceObj.delete(`/jobs/get/all`)
    }

    deleteTrigger = async (trigger_id) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.delete(`/jobs/${trigger_id}`)
    }

    addDataset = async (reqObj, project_id) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.post(`/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/project_id/${project_id}/create/monitor/service`, reqObj)
    }

    //  Analytics Service
    addAnalyticsDataset = async (reqObj, project_id) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.post(`/an_service/subscriber_id/${this.subscriberId}/subscription_id/${this.subscriptionId}/account_id/${this.accountId}/project_id/${project_id}/analytic_service/create`, reqObj)
    }

    syncLinks = async (project_id, job_id) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.post(`/an_service/subscriber_id/${this.subscriberId}/subscription_id/${this.subscriptionId}/account_id/${this.accountId}/project_id/${project_id}/analytic_service/links/sync_now?job_id=${job_id}`)
    }

    deleteJobs = async (reqObj) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.post(`/an_service/delete/jobs`, reqObj)
    }

    getStatus = async (job_id) => {
        await this.initialize();
        return AxiosMonitoringServiceObj.get(`/job-executions/${job_id}?status=failure`)
    }

}

const MonitoringServiceApi = new AmeyaBackendApi();
export default MonitoringServiceApi;


