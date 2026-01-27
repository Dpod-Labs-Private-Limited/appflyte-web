import axios from "axios";
import agentApiTokenManager from "../../utils/AgentApiToken/getAgentAdminToken";
import { getSessionData } from "../../utils/sessionDataHandle";

const getAgentApiToken = async () => {
    const currentProject = getSessionData("selected_project")
    if (currentProject) {
        const token = await agentApiTokenManager.getAgentAdminToken();
        return token ?? null
    }
    return null
}

const requestHandler = async (request) => {
    const agentTokenId = await getAgentApiToken()
    request.headers['Authorization'] = `Bearer ${agentTokenId}`;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Accept'] = 'application/json';
    return request
}

const noAuthRequestHandler = async (request) => {
    request.headers['Content-Type'] = 'application/json';
    request.headers['Accept'] = 'application/json';
    return request
}

const AxiosAnalyticsObj = axios.create({
    baseURL: process.env.REACT_APP_ANALYTICS_BASE_URL,
    responseType: "json"
});

const AxiosExtractionObj = axios.create({
    baseURL: process.env.REACT_APP_TEMPLATE_EXTRACTION_URL,
    responseType: "json"
})

const AxiosMonitoringServiceObj = axios.create({
    baseURL: process.env.REACT_APP_MONITOR_SERVICE_URL,
    responseType: "json"
});

const AxiosCostUsageServiceObj = axios.create({
    baseURL: process.env.REACT_APP_COST_USAGE_SERVICE_URL,
    responseType: "json"
});

const AxiosStripeServiceObj = axios.create({
    baseURL: process.env.REACT_APP_STRIPE_SERVICE_URL,
    responseType: "json"
});

const AxiosAppflyteAnServiceObj = axios.create({
    baseURL: process.env.REACT_APP_APPFLYTE_ANALYTICS_URL,
    responseType: "json"
});

AxiosAnalyticsObj.interceptors.request.use(request => requestHandler(request))
AxiosExtractionObj.interceptors.request.use(request => requestHandler(request))
AxiosMonitoringServiceObj.interceptors.request.use(request => requestHandler(request))
AxiosAppflyteAnServiceObj.interceptors.request.use(request => requestHandler(request))
AxiosCostUsageServiceObj.interceptors.request.use(request => noAuthRequestHandler(request))
AxiosStripeServiceObj.interceptors.request.use(request => noAuthRequestHandler(request))

export { AxiosAnalyticsObj, AxiosExtractionObj, AxiosMonitoringServiceObj, AxiosStripeServiceObj, AxiosCostUsageServiceObj, AxiosAppflyteAnServiceObj };